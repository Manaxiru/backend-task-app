import { Request } from "express";


export interface ITypedRequestBody<T> extends Request {
    body: T;
}