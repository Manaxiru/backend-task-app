import { DocumentData } from "firebase-admin/firestore";


export interface IResponse<T> {
    data?: T | T[] | DocumentData | unknown;
    message: string;
}