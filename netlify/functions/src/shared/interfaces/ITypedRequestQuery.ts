import { Query } from "express-serve-static-core";
import { Request } from "express";


export interface ITypedRequestQuery<T extends Query> extends Request {
    query: T;
}