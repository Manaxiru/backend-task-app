import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getAuth, signInWithCustomToken, UserCredential } from "firebase/auth";


export class AuthRepository {
  private static _instance: AuthRepository;

  static getInstance(): AuthRepository {
    if (this._instance) return this._instance;
    this._instance = new AuthRepository();
    return this._instance;
  }

  createCustomToken(uid: string) { return getAdminAuth().createCustomToken(uid); }

  loginWithEmail(token: string): Promise<UserCredential> { return signInWithCustomToken(getAuth(), token); }

  logout(id: string): Promise<void> { return getAdminAuth().revokeRefreshTokens(id); }
}