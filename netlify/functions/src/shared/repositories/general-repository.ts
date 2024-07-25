import { getAuth } from "firebase-admin/auth";
import { IUsers } from "@shared/interfaces";


export class GeneralRepository {
  private static _instance: GeneralRepository;

  static getInstance(): GeneralRepository {
    if (this._instance) return this._instance;
    this._instance = new GeneralRepository();
    return this._instance;
  }

  readByEmail(email: string): Promise<IUsers> { return getAuth().getUserByEmail(email) as Promise<IUsers>; }
}