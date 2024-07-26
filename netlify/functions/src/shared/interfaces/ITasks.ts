import { Timestamp } from "firebase-admin/firestore";


export interface ITask {
    title: string;
    description: string;
    completed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}