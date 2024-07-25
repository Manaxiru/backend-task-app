import { UserRecord } from "firebase-admin/auth";


interface IUsersBase {
    email: string;
}

export type IUsers = IUsersBase & UserRecord;