import { Response } from "express";
import { Send } from "express-serve-static-core";
import { IResponse } from "@shared/interfaces"


export interface ITypedResponse<T> extends Response {
    json: Send<IResponse<T>, this>;
}