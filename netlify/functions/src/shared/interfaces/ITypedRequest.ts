import { Query } from "express-serve-static-core";
import { Request } from "express";


export interface ITypedRequest<T extends Query, U> extends Request {
    body: U;
    query: T;
}