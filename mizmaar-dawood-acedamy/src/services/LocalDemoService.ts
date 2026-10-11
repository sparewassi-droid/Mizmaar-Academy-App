import {
  MultiplayerService,
  FriendUser,
  DuelSession,
  DuelFormat,
  AgeGroup,
  PresetReaction,
} from '../types';
import { ALL_QUESTIONS_MAP } from '../data/modules';
import { seededShuffle } from '../utils/seededShuffle';

const CHANNEL_NAME = 'tajweed_quest_multiplayer_channel';

export class LocalDemoService implements MultiplayerService {
  private currentUser: { id: string; username: string } = { id: 'local_user', username: 'student' };
  private channel: BroadcastChannel | null = null;
  private friendListeners: ((friends: FriendUser[]) => void)[] = [];
  private duelListeners: Map<string, ((duel: DuelSession) => void)[]> = new Map();
  private botTimers: Map<string, NodeJS.Timeout[]> = new Map();

  private defaultFriends: FriendUser[] = [
    {
      id: 'bot_medium',
      username: 'practice_bot',
      levelTitle: 'Practitioner',
      status: 'online',
      isBot: true,
      botDifficulty: 'medium',
    },
    {
      id: 'bot_slow',
      username: 'gentle_guide',
      levelTitle: 'Reciter',
      status: 'online',
      isBot: true,
      botDifficulty: 'slow',
    },
    {
      id: 'bot_fast',
      username: 'swift_scholar',
      levelTitle: 'Master',
      status: 'online',
      isBot: true,
      botDifficulty: 'fast',
    },
  ];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch {
        this.channel = null;
      }
    }
  }

  private handleBroadcastMessage(data: { type: string; payload: unknown }) {
    if (data.type === 'DUEL_UPDATE') {
      const duel = data.payload as DuelSession;
      this.saveDuel(duel);
      this.notifyDuelListeners(duel.id, duel);
    } else if (data.type === 'FRIEND_UPDATE') {
      this.notifyFriendListeners();
    }
  }

  public async signIn(user: { id: string; username: string }): Promise<void> {
    this.currentUser = user;
    const users = this.getKnownUsers();
    if (!users.some((u) => u.id === user.id)) {
      users.push({
        id: user.id,
        username: user.username,
        levelTitle: 'Explorer',
        status: 'online',
      });
      this.saveKnownUsers(users);
    }
  }

  public async isUsernameAvailable(name: string): Promise<boolean> {
    const users = this.getKnownUsers();
    return !users.some((u) => u.username.toLowerCase() === name.toLowerCase() && u.id !== this.currentUser.id);
  }

  public async findUser(name: string): Promise<FriendUser | null> {
    const users = this.getKnownUsers();
    const user = users.find((u) => u.username.toLowerCase() === name.toLowerCase());
    return user || null;
  }

  public async sendFriendRequest(name: string): Promise<boolean> {
    const user = await this.findUser(name);
    if (!user) return false;

    const friends = await this.listFriends();
    if (!friends.some((f) => f.id === user.id)) {
      friends.push({ ...user, status: 'online' });
      this.saveFriends(friends);
      this.notifyFriendListeners();
    }
    return true;
  }

  public async respondToRequest(id: string, accept: boolean): Promise<void> {
    const users = this.getKnownUsers();
    const reqUser = users.find((u) => u.id === id);
    if (accept && reqUser) {
      const friends = await this.listFriends();
      if (!friends.some((f) => f.id === reqUser.id)) {
        friends.push(reqUser);
        this.saveFriends(friends);
        this.notifyFriendListeners();
      }
    }
  }

  public async listFriends(): Promise<FriendUser[]> {
    try {
      const raw = localStorage.getItem('tajweed_quest_friends');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return this.defaultFriends;
  }

  private saveFriends(friends: FriendUser[]): void {
    try {
      localStorage.setItem('tajweed_quest_friends', JSON.stringify(friends));
    } catch {
      // ignore
    }
    this.channel?.postMessage({ type: 'FRIEND_UPDATE' });
  }

  public subscribeFriends(cb: (friends: FriendUser[]) => void): () => void {
    this.friendListeners.push(cb);
    this.listFriends().then(cb);
    return () => {
      this.friendListeners = this.friendListeners.filter((l) => l !== cb);
    };
  }

  private notifyFriendListeners() {
    this.listFriends().then((friends) => {
      this.friendListeners.forEach((cb) => cb(friends));
    });
  }

  public async blockUser(id: string): Promise<void> {
    const friends = (await this.listFriends()).filter((f) => f.id !== id);
    this.saveFriends(friends);
    this.notifyFriendListeners();
  }

  public async reportUser(id: string, reason: string): Promise<void> {
    try {
      const existing = JSON.parse(localStorage.getItem('tajweed_quest_reports') || '[]');
      existing.push({ id, reason, timestamp: Date.now() });
      localStorage.setItem('tajweed_quest_reports', JSON.stringify(existing));
    } catch {
      // ignore
    }
  }

  // --- DUEL LOGIC ---
  public async createDuel(params: {
    friendId: string;
    moduleId: string;
    ageGroup: AgeGroup;
    format: DuelFormat;
    seed: string;
  }): Promise<string> {
    const friends = await this.listFriends();
    const opponentUser = friends.find((f) => f.id === params.friendId) || this.defaultFriends[0];

    const duelId = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Select questions deterministically using seed
    const moduleQs = ALL_QUESTIONS_MAP[params.moduleId] || ALL_QUESTIONS_MAP.a1_basic_tajweed;
    let selectedIds: string[] = [];

    if (params.format === 'classic') {
      // Exactly 10 questions: 3 easy, 4 moderate, 3 difficult in that order
      const easy = seededShuffle(moduleQs.filter((q) => q.tier === 'easy'), `${params.seed}_e`).slice(0, 3);
      const mod = seededShuffle(moduleQs.filter((q) => q.tier === 'moderate'), `${params.seed}_m`).slice(0, 4);
      const diff = seededShuffle(moduleQs.filter((q) => q.tier === 'difficult'), `${params.seed}_d`).slice(0, 3);
      selectedIds = [...easy, ...mod, ...diff].map((q) => q.id);
    } else {
      // Sprint Race: up to 15 questions
      selectedIds = seededShuffle(moduleQs, params.seed).slice(0, 15).map((q) => q.id);
    }

    const duel: DuelSession = {
      id: duelId,
      format: params.format,
      moduleId: params.moduleId,
      ageGroup: params.ageGroup,
      seed: params.seed,
      status: opponentUser.isBot ? 'ready' : 'waiting',
      countdown: 3,
      questionIds: selectedIds,
      challenger: {
        id: this.currentUser.id,
        username: this.currentUser.username,
        levelTitle: 'Reciter',
        ready: true,
        score: 0,
        correctCount: 0,
        totalAnswerTimeMs: 0,
        currentQuestionIndex: 0,
      },
      opponent: {
        id: opponentUser.id,
        username: opponentUser.username,
        levelTitle: opponentUser.levelTitle,
        ready: !!opponentUser.isBot,
        score: 0,
        correctCount: 0,
        totalAnswerTimeMs: 0,
        currentQuestionIndex: 0,
      },
    };

    this.saveDuel(duel);
    this.broadcastDuel(duel);

    return duelId;
  }

  public subscribeDuel(duelId: string, cb: (duel: DuelSession) => void): () => void {
    if (!this.duelListeners.has(duelId)) {
      this.duelListeners.set(duelId, []);
    }
    this.duelListeners.get(duelId)!.push(cb);

    const duel = this.getDuel(duelId);
    if (duel) cb(duel);

    return () => {
      const list = this.duelListeners.get(duelId) || [];
      this.duelListeners.set(duelId, list.filter((l) => l !== cb));
    };
  }

  private notifyDuelListeners(duelId: string, duel: DuelSession) {
    const listeners = this.duelListeners.get(duelId) || [];
    listeners.forEach((cb) => cb(duel));
  }

  public async setReady(duelId: string, ready: boolean): Promise<void> {
    const duel = this.getDuel(duelId);
    if (!duel) return;

    if (this.currentUser.id === duel.challenger.id) {
      duel.challenger.ready = ready;
    } else {
      duel.opponent.ready = ready;
    }

    if (duel.challenger.ready && duel.opponent.ready && duel.status === 'ready') {
      duel.status = 'countdown';
      this.saveDuel(duel);
      this.broadcastDuel(duel);
      this.startCountdown(duelId);
    } else {
      this.saveDuel(duel);
      this.broadcastDuel(duel);
    }
  }

  private startCountdown(duelId: string) {
    let count = 3;
    const interval = setInterval(() => {
      const duel = this.getDuel(duelId);
      if (!duel) {
        clearInterval(interval);
        return;
      }
      count--;
      duel.countdown = count;
      if (count <= 0) {
        clearInterval(interval);
        duel.status = 'in-progress';
        this.saveDuel(duel);
        this.broadcastDuel(duel);
        this.scheduleBotAnswers(duelId);
      } else {
        this.saveDuel(duel);
        this.broadcastDuel(duel);
      }
    }, 1000);
  }

  public async submitAnswer(
    duelId: string,
    questionIndex: number,
    _answer: unknown,
    timeMs: number,
    isCorrect: boolean,
    pointsAwarded: number
  ): Promise<void> {
    const duel = this.getDuel(duelId);
    if (!duel || duel.status !== 'in-progress') return;

    const isChallenger = this.currentUser.id === duel.challenger.id;
    const participant = isChallenger ? duel.challenger : duel.opponent;

    participant.score += pointsAwarded;
    if (isCorrect) participant.correctCount += 1;
    participant.totalAnswerTimeMs += timeMs;
    participant.currentQuestionIndex = questionIndex + 1;
    participant.lastAnswerSubmitted = true;

    // Check completion condition
    this.evaluateDuelProgress(duel);

    this.saveDuel(duel);
    this.broadcastDuel(duel);
  }

  private evaluateDuelProgress(duel: DuelSession) {
    if (duel.format === 'sprint') {
      // First player to 5 correct answers wins immediately!
      if (duel.challenger.correctCount >= 5 && duel.opponent.correctCount < 5) {
        duel.status = 'completed';
        duel.winnerId = duel.challenger.id;
      } else if (duel.opponent.correctCount >= 5 && duel.challenger.correctCount < 5) {
        duel.status = 'completed';
        duel.winnerId = duel.opponent.id;
      } else if (duel.challenger.correctCount >= 5 && duel.opponent.correctCount >= 5) {
        duel.status = 'completed';
        duel.winnerId =
          duel.challenger.totalAnswerTimeMs <= duel.opponent.totalAnswerTimeMs
            ? duel.challenger.id
            : duel.opponent.id;
      } else if (
        duel.challenger.currentQuestionIndex >= duel.questionIds.length &&
        duel.opponent.currentQuestionIndex >= duel.questionIds.length
      ) {
        duel.status = 'completed';
        if (duel.challenger.correctCount !== duel.opponent.correctCount) {
          duel.winnerId =
            duel.challenger.correctCount > duel.opponent.correctCount
              ? duel.challenger.id
              : duel.opponent.id;
        } else {
          duel.winnerId =
            duel.challenger.totalAnswerTimeMs <= duel.opponent.totalAnswerTimeMs
              ? duel.challenger.id
              : duel.opponent.id;
        }
      }
    } else {
      // Classic Duel: 10 questions.
      if (
        duel.challenger.currentQuestionIndex >= duel.questionIds.length &&
        duel.opponent.currentQuestionIndex >= duel.questionIds.length
      ) {
        duel.status = 'completed';
        if (duel.challenger.score > duel.opponent.score) {
          duel.winnerId = duel.challenger.id;
        } else if (duel.opponent.score > duel.challenger.score) {
          duel.winnerId = duel.opponent.id;
        } else {
          // Tie break: higher correct count, then lower total time
          if (duel.challenger.correctCount !== duel.opponent.correctCount) {
            duel.winnerId =
              duel.challenger.correctCount > duel.opponent.correctCount
                ? duel.challenger.id
                : duel.opponent.id;
          } else {
            duel.winnerId =
              duel.challenger.totalAnswerTimeMs <= duel.opponent.totalAnswerTimeMs
                ? duel.challenger.id
                : duel.opponent.id;
          }
        }
      }
    }
  }

  // Practice Bot automation
  private scheduleBotAnswers(duelId: string) {
    const duel = this.getDuel(duelId);
    if (!duel) return;

    const opponent = duel.opponent;
    if (!opponent.id.startsWith('bot_')) return;

    const difficulty = (opponent.id === 'bot_fast' ? 'fast' : opponent.id === 'bot_slow' ? 'slow' : 'medium');
    const accuracy = difficulty === 'fast' ? 0.95 : difficulty === 'medium' ? 0.85 : 0.7;
    const baseDelay = difficulty === 'fast' ? 3000 : difficulty === 'medium' ? 5500 : 9000;

    const timers: NodeJS.Timeout[] = [];

    duel.questionIds.forEach((_qId, index) => {
      const jitter = (Math.random() - 0.5) * 1500;
      const delay = (index + 1) * (baseDelay + jitter);

      const timer = setTimeout(() => {
        const currentDuel = this.getDuel(duelId);
        if (!currentDuel || currentDuel.status !== 'in-progress') return;

        const isCorrect = Math.random() < accuracy;
        const answerTime = Math.round(baseDelay + jitter);
        const pts = isCorrect ? Math.round(100 + (30000 - Math.min(25000, answerTime)) / 300) : 0;

        currentDuel.opponent.score += pts;
        if (isCorrect) currentDuel.opponent.correctCount += 1;
        currentDuel.opponent.totalAnswerTimeMs += answerTime;
        currentDuel.opponent.currentQuestionIndex = index + 1;
        currentDuel.opponent.lastAnswerSubmitted = true;

        this.evaluateDuelProgress(currentDuel);
        this.saveDuel(currentDuel);
        this.broadcastDuel(currentDuel);
      }, delay);

      timers.push(timer);
    });

    this.botTimers.set(duelId, timers);
  }

  public async sendReaction(duelId: string, reaction: PresetReaction): Promise<void> {
    const duel = this.getDuel(duelId);
    if (!duel) return;

    if (this.currentUser.id === duel.challenger.id) {
      duel.challenger.reaction = { text: reaction, timestamp: Date.now() };
    } else {
      duel.opponent.reaction = { text: reaction, timestamp: Date.now() };
    }

    this.saveDuel(duel);
    this.broadcastDuel(duel);
  }

  public async leaveDuel(duelId: string): Promise<void> {
    const duel = this.getDuel(duelId);
    if (!duel) return;

    duel.status = 'abandoned';
    this.saveDuel(duel);
    this.broadcastDuel(duel);

    // Clear bot timers
    const timers = this.botTimers.get(duelId);
    if (timers) {
      timers.forEach(clearTimeout);
      this.botTimers.delete(duelId);
    }
  }

  // --- STORAGE HELPERS ---
  private getDuel(duelId: string): DuelSession | null {
    try {
      const raw = localStorage.getItem(`tajweed_quest_duel_${duelId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveDuel(duel: DuelSession): void {
    try {
      localStorage.setItem(`tajweed_quest_duel_${duel.id}`, JSON.stringify(duel));
    } catch {
      // ignore
    }
  }

  private broadcastDuel(duel: DuelSession): void {
    this.notifyDuelListeners(duel.id, duel);
    this.channel?.postMessage({ type: 'DUEL_UPDATE', payload: duel });
  }

  private getKnownUsers(): FriendUser[] {
    try {
      const raw = localStorage.getItem('tajweed_quest_known_users');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [...this.defaultFriends];
  }

  private saveKnownUsers(users: FriendUser[]): void {
    try {
      localStorage.setItem('tajweed_quest_known_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }
}
