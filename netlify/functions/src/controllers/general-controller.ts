import {
    Controller,
    Response,
    Get
} from "@decorators/express";
import { Messages } from "@shared/enums";
import { ITypedResponse } from "@shared/interfaces";


@Controller('/')
export class GeneralController {
    @Get('/')
    async check(@Response() res: ITypedResponse<any>) {
        try {
            return res.status(200).json({ success: true, message: Messages.CHECK });
        } catch (err) {
            return res.status(500).json({ data: err, success: false, message: Messages.ERROR });
        }
    }
}