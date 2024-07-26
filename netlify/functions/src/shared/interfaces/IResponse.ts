import { DocumentData } from "firebase-admin/firestore";


export interface IResponse<T> {
    data?: T | T[] | DocumentData | unknown;
    count?: number;
    success: boolean;
    message: string;
}