import {
    Controller,
    Req,
    Body,
    Params,
    Response,
    Get,
    Post
} from "@decorators/express";
import { body, param, validationResult } from "express-validator";
import { UsersRepository } from "@repository/users-repository";
import { GeneralRepository } from "@shared/repositories";
import { BackendModules, Messages } from "@shared/enums";
import { ITypedResponse, ITypedRequestBody, IUsers } from "@shared/interfaces";
import { InternalRoutes } from "@shared/constants";


@Controller('/' + BackendModules.USERS)
export class UsersController {
    private readonly repository: GeneralRepository;
    private readonly userRepository: UsersRepository;

    constructor() {
        this.repository = UsersRepository.getInstance();
        this.userRepository = UsersRepository.getInstance();
    }

    private async emailExist(email: string): Promise<boolean> {
        return Boolean(await this.repository.readByEmail(email)
            .catch(err => {
                if (err.errorInfo && err.errorInfo.code === "auth/user-not-found") return false;
                throw err;
            }));
    }

    @Get(`/:${InternalRoutes.USERS.EMAIL}`, [param(InternalRoutes.USERS.EMAIL).trim().isEmail()])
    async findOneByEmail(@Req() req: ITypedRequestBody<IUsers>, @Response() res: ITypedResponse<IUsers>, @Params(InternalRoutes.USERS.EMAIL) email: string) {
        try {
            if (!validationResult(req).isEmpty()) return res.status(400).json({ message: Messages.EMAIL_INVALID });

            if (!(await this.emailExist(email))) return res.status(404).json({ message: Messages.EMAIL_NOT_FOUND });

            return res.status(200).json({ message: Messages.EMAIL_FOUND });
        } catch (err) {
            return res.status(500).json({ data: err, message: Messages.ERROR });
        }
    }

    @Post('/', [body("email").trim().isEmail()])
    async create(@Req() req: ITypedRequestBody<IUsers>, @Body() body: IUsers, @Response() res: ITypedResponse<IUsers>) {
        try {
            if (!validationResult(req).isEmpty()) return res.status(400).json({ message: Messages.EMAIL_INVALID });

            if (await this.emailExist(body.email)) return res.status(409).json({ message: Messages.EMAIL_FOUND });

            const user = await this.userRepository.create({ email: body.email });

            return res.status(201).json({
                data: user,
                message: Messages.EMAIL_REGISTERED
            });
        } catch (err) {
            return res.status(500).json({ data: err, message: Messages.ERROR });
        }
    }
}