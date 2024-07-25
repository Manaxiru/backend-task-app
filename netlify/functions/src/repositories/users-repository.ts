import { getAuth, UserRecord } from "firebase-admin/auth";
import { IUsers } from "@shared/interfaces";


export class UsersRepository {
  private static _instance: UsersRepository;

  static getInstance(): UsersRepository {
    if (this._instance) return this._instance;
    this._instance = new UsersRepository();
    return this._instance;
  }

  create(data: Partial<IUsers>): Promise<UserRecord> { return getAuth().createUser({ email: data.email }); }

  readByEmail(email: string): Promise<IUsers> { return getAuth().getUserByEmail(email) as Promise<IUsers>; }
}