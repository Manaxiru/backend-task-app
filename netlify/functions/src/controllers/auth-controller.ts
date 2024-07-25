import {
    Controller,
    Req,
    Body,
    Response,
    Post
} from "@decorators/express";
import { body, validationResult } from "express-validator";
import { AuthRepository } from "@repository/auth-repository";
import { GeneralRepository } from "@shared/repositories";
import { Auth } from "@middleware/auth";
import { BackendModules, Messages } from "@shared/enums";
import { ITypedResponse, ITypedRequestBody, IUsers } from "@shared/interfaces";
import { InternalRoutes } from "@shared/constants";


@Controller('/' + BackendModules.AUTH)
export class AuthController {
    private readonly repository: GeneralRepository;
    private readonly authRepository: AuthRepository;

    constructor() {
        this.repository = GeneralRepository.getInstance();
        this.authRepository = AuthRepository.getInstance();
    }

    private getUser(email: string): Promise<IUsers> { return this.repository.readByEmail(email); }

    @Post(`/${InternalRoutes.AUTH.LOGIN}`, [body("email").trim().isEmail()])
    async login(@Req() req: ITypedRequestBody<IUsers>, @Body() body: IUsers, @Response() res: ITypedResponse<IUsers>) {
        try {
            if (!validationResult(req).isEmpty()) return res.status(400).json({ message: Messages.EMAIL_INVALID });

            this.getUser(body.email)
                .then(async user => {
                    const token = await this.authRepository.createCustomToken(user.uid);
                    const credential = await this.authRepository.loginWithEmail(token);

                    return res.status(200).json({
                        data: {
                            email: credential.user.email,
                            token: (credential.user as any).accessToken,
                            expirationTime: (credential.user as any).stsTokenManager.expirationTime,
                            createdAt: (credential.user.toJSON() as any).createdAt,
                            lastLoginAt: (credential.user.toJSON() as any).lastLoginAt
                        },
                        message: Messages.VALID_LOGIN
                    });
                })
                .catch(err => {
                    if (err.errorInfo && err.errorInfo.code === "auth/user-not-found")
                        return res.status(404).json({ data: err, message: Messages.EMAIL_NOT_FOUND });
                    throw err;
                });

            return;
        } catch (err) {
            return res.status(500).json({ data: err, message: Messages.ERROR });
        }
    }

    @Post(`/${InternalRoutes.AUTH.LOGOUT}`, [Auth])
    async logout(@Response() res: ITypedResponse<IUsers>) {
        try {
            await this.authRepository.logout(res.locals.user.uid);

            return res.status(200).json({ message: Messages.VALID_LOGOUT });
        } catch (err) {
            return res.status(500).json({ data: err, message: Messages.ERROR });
        }
    }
}