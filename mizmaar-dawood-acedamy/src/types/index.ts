export type AgeGroup = '7-11' | '11-14';
export type Tier = 'easy' | 'moderate' | 'difficult';

export type QuestionType =
  | 'mcq'
  | 'truefalse'
  | 'multiselect'
  | 'match'
  | 'sort'
  | 'order'
  | 'odd'
  | 'tap';

export interface QuestionOption {
  id: string;
  label: string;
  arabic?: string;
  isCorrect: boolean;
}

export interface MatchPair {
  left: string;
  right: string;
  leftArabic?: string;
  rightArabic?: string;
}

export interface SortItem {
  id: string;
  text: string;
  arabic?: boolean;
}

export interface SortGroup {
  name: string;
  items: SortItem[];
}

export interface PhraseToken {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  ageGroup: AgeGroup;
  moduleId: string;
  tier: Tier;
  type: QuestionType;
  prompt: string;
  arabicDisplay?: string;
  tokens?: PhraseToken[];
  options?: QuestionOption[];
  pairs?: MatchPair[];
  groups?: SortGroup[];
  order?: string[];
  answerTokenIds?: string[];
  answer?: boolean;
  explanation: string;
  factRef: string;
}

export interface Fact {
  id: string;
  text: string;
  source: 'supplied';
}

export interface StageResultSummary {
  ageGroup: string;
  moduleId: string;
  tier: Tier;
  stars: number;
  correct: number;
  total: number;
  points: number;
  accuracy: number;
  avgTimeSeconds: number;
  xpGained: number;
}

export interface DuelResultSummary {
  format: 'classic' | 'sprint';
  moduleId: string;
  won: boolean;
  myScore: number;
  opponentScore: number;
}

export interface StageProgress {
  passed: boolean;
  stars: number;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
}

export interface ModuleProgress {
  id: string;
  unlocked: boolean;
  stages: {
    easy: StageProgress;
    moderate: StageProgress;
    difficult: StageProgress;
  };
  sealEarned: boolean;
}

export interface TodaysQuest {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  rewardXp: number;
}

export interface GrownUpsSettings {
  onlinePlayEnabled: boolean;
  timerMode: 'normal' | 'extra' | 'none';
  allRegionsUnlocked: boolean;
}

export interface FriendUser {
  id: string;
  username: string;
  levelTitle: string;
  status: 'online' | 'offline' | 'in-duel';
  isBot?: boolean;
  botDifficulty?: 'slow' | 'medium' | 'fast';
}

export interface FriendRequest {
  id: string;
  fromUsername: string;
  timestamp: number;
}

export interface ProgressState {
  userId: string;
  username: string;
  ageGroup: AgeGroup;
  levelTitle: string;
  level: number;
  xp: number;
  totalPoints: number;
  totalStars: number;
  modules: Record<string, ModuleProgress>;
  todaysQuest: TodaysQuest;
  grownUps: GrownUpsSettings;
  friends: FriendUser[];
  friendRequests: FriendRequest[];
  blockedUsers: string[];
  reportedUsers: { userId: string; reason: string; timestamp: number }[];
}

export type DuelFormat = 'classic' | 'sprint';
export type PresetReaction = 'Good luck' | 'Well played' | 'Nice one' | 'Rematch?';

export interface DuelParticipant {
  id: string;
  username: string;
  levelTitle: string;
  ready: boolean;
  score: number;
  correctCount: number;
  totalAnswerTimeMs: number;
  currentQuestionIndex: number;
  lastAnswerSubmitted?: boolean;
  reaction?: { text: PresetReaction; timestamp: number };
}

export interface DuelSession {
  id: string;
  format: DuelFormat;
  moduleId: string;
  ageGroup: AgeGroup;
  seed: string;
  status: 'waiting' | 'ready' | 'countdown' | 'in-progress' | 'completed' | 'abandoned';
  countdown: number;
  questionIds: string[];
  challenger: DuelParticipant;
  opponent: DuelParticipant;
  winnerId?: string;
  disconnectWarning?: { userId: string; startTimestamp: number };
  currentQuestionReveal?: {
    questionIndex: number;
    revealed: boolean;
  };
}

export interface MultiplayerService {
  signIn(user: { id: string; username: string }): Promise<void>;
  isUsernameAvailable(name: string): Promise<boolean>;
  findUser(name: string): Promise<FriendUser | null>;
  sendFriendRequest(name: string): Promise<boolean>;
  respondToRequest(id: string, accept: boolean): Promise<void>;
  listFriends(): Promise<FriendUser[]>;
  subscribeFriends(cb: (friends: FriendUser[]) => void): () => void;
  blockUser(id: string): Promise<void>;
  reportUser(id: string, reason: string): Promise<void>;
  createDuel(params: {
    friendId: string;
    moduleId: string;
    ageGroup: AgeGroup;
    format: DuelFormat;
    seed: string;
  }): Promise<string>;
  subscribeDuel(duelId: string, cb: (duel: DuelSession) => void): () => void;
  setReady(duelId: string, ready: boolean): Promise<void>;
  submitAnswer(
    duelId: string,
    questionIndex: number,
    answer: unknown,
    timeMs: number,
    isCorrect: boolean,
    pointsAwarded: number
  ): Promise<void>;
  sendReaction(duelId: string, reaction: PresetReaction): Promise<void>;
  leaveDuel(duelId: string): Promise<void>;
}

export interface ModuleDefinition {
  id: string;
  ageGroup: AgeGroup;
  code: string; // 'a1', 'b2', etc.
  title: string;
  arabicSubtitle?: string;
  regionName: string; // e.g. "The Lantern Gate" or "Chapter I"
  landmarkKey: string;
  accentBg: string;
  accentSolid: string;
  accentLight: string;
  description: string;
  totalQuestions: number;
}
