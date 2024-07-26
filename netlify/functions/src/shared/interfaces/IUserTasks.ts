import { Timestamp } from "firebase-admin/firestore";
import { ITask } from "@shared/interfaces";


export interface IUserTask {
    email: string;
    createdAt: Timestamp;
    tasks: ITask[];
}