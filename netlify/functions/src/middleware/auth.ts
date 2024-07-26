import { Request, NextFunction } from "express";
import { Middleware } from '@decorators/express';
import { ITypedResponse } from "@shared/interfaces";
import { Messages } from "@shared/enums";
import { getAuth } from "firebase-admin/auth";


export class Auth implements Middleware {
    async use(req: Request, res: ITypedResponse<undefined>, next: NextFunction) {
        if (req.header('Authorization')) {
            try {
                res.locals.user = await getAuth().verifyIdToken(req.header('Authorization')!.split(' ')[1], true);
                return next();
            } catch (err: any) {
                return res.status(401).json({
                    success: false,
                    message: err.errorInfo && err.errorInfo.code === "auth/id-token-revoked" ?
                        Messages.VALID_LOGOUT : Messages.TOKEN_ERROR
                });
            }
        } else
            return res.status(401).json({ success: false, message: Messages.TOKEN_INVALID });
    }
}