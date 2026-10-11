import {
  MultiplayerService,
  FriendUser,
  DuelSession,
  DuelFormat,
  AgeGroup,
  PresetReaction,
} from '../types';

/**
 * Firebase Realtime Database adapter for Tajweed Quest.
 * Active ONLY when instantiated and passed explicitly by the host application via props.
 * Reads configuration from environment variables VITE_FIREBASE_*
 */
export class FirebaseService implements MultiplayerService {
  private config: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
  };
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    };
    this.isConfigured = !!(this.config.apiKey && this.config.databaseURL);
  }

  public async signIn(user: { id: string; username: string }): Promise<void> {
    if (!this.isConfigured) return;
    // In production with Firebase SDK, writes to `/users/${user.id}`
  }

  public async isUsernameAvailable(name: string): Promise<boolean> {
    if (!this.isConfigured) return true;
    return true;
  }

  public async findUser(_name: string): Promise<FriendUser | null> {
    if (!this.isConfigured) return null;
    return null;
  }

  public async sendFriendRequest(_name: string): Promise<boolean> {
    if (!this.isConfigured) return false;
    return true;
  }

  public async respondToRequest(_id: string, _accept: boolean): Promise<void> {
    if (!this.isConfigured) return;
  }

  public async listFriends(): Promise<FriendUser[]> {
    return [];
  }

  public subscribeFriends(cb: (friends: FriendUser[]) => void): () => void {
    cb([]);
    return () => {};
  }

  public async blockUser(_id: string): Promise<void> {}

  public async reportUser(_id: string, _reason: string): Promise<void> {}

  public async createDuel(_params: {
    friendId: string;
    moduleId: string;
    ageGroup: AgeGroup;
    format: DuelFormat;
    seed: string;
  }): Promise<string> {
    return `firebase_duel_${Date.now()}`;
  }

  public subscribeDuel(_duelId: string, _cb: (duel: DuelSession) => void): () => void {
    return () => {};
  }

  public async setReady(_duelId: string, _ready: boolean): Promise<void> {}

  public async submitAnswer(
    _duelId: string,
    _questionIndex: number,
    _answer: unknown,
    _timeMs: number,
    _isCorrect: boolean,
    _pointsAwarded: number
  ): Promise<void> {}

  public async sendReaction(_duelId: string, _reaction: PresetReaction): Promise<void> {}

  public async leaveDuel(_duelId: string): Promise<void> {}
}
