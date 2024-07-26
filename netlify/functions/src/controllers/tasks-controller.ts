import {
    Controller,
    Req,
    Body,
    Params,
    Response,
    Get,
    Post
} from "@decorators/express";
import { body, ValidationChain, validationResult } from "express-validator";
import { TasksRepository } from "@repository/tasks-repository";
import { Auth } from "@middleware/auth";
import { Timestamp } from "firebase-admin/firestore";
import { BackendModules, Messages } from "@shared/enums";
import { ITypedResponse, ITypedRequestBody, IUsers, ITask } from "@shared/interfaces";


@Controller('/' + BackendModules.TASKS, [Auth])
export class TasksController {
    private readonly taskRepository: TasksRepository;

    constructor() { this.taskRepository = TasksRepository.getInstance(); }

    @Post('/', taskValidations())
    async create(@Req() req: ITypedRequestBody<ITask>, @Body() body: Partial<ITask>, @Response() res: ITypedResponse<ITask>) {
        try {
            if (!validationResult(req).isEmpty()) {
                const errorsMessages = validationResult(req).array().map(x => x.msg);
                return res.status(400).json({ success: false, message: errorsMessages.length > 1 ? errorsMessages : errorsMessages[0] });
            }

            const checkUserTask = (await this.taskRepository.readOne(res.locals.user.uid)).exists;

            const task: Partial<ITask> = { ...body, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };

            if (!checkUserTask)
                await this.taskRepository
                    .createWithId(res.locals.user.uid, { email: res.locals.user.email, createdAt: Timestamp.now() })
                    .then(async () => await this.taskRepository.create(res.locals.user.uid, task));
            else
                await this.taskRepository.create(res.locals.user.uid, task);

            return res.status(201).json({
                data: { ...task, createdAt: task.createdAt?.seconds, updatedAt: task.updatedAt?.seconds },
                success: true,
                message: Messages.TASK_REGISTERED
            });
        } catch (err) {
            return res.status(500).json({ data: err, success: false, message: Messages.ERROR });
        }
    }

    @Get('/')
    async readAll(@Response() res: ITypedResponse<IUsers>) {
        try {
            const tasksSnapshot = await this.taskRepository.readAllCollection(res.locals.user.uid, undefined, "createdAt");

            const tasks: ITask[] = [];

            if (!tasksSnapshot.empty) {
                tasksSnapshot.forEach(taskDoc =>
                    tasks.push({ ...taskDoc.data(), createdAt: taskDoc.data().createdAt?.seconds, updatedAt: taskDoc.data().updatedAt?.seconds } as ITask)
                );
            }

            return res.status(200).json({ data: tasks, count: tasks.length, success: true, message: "" });
        } catch (err) {
            return res.status(500).json({ data: err, success: false, message: Messages.ERROR });
        }
    }
}

function taskValidations(): ValidationChain[] {
    return [
        body("title").isString().withMessage(Messages.TASK_INVALID_TITLE).bail().trim().notEmpty().withMessage(Messages.TASK_EMPTY_TITLE),
        body("description").isString().withMessage(Messages.TASK_INVALID_DESCRIPTION).bail().trim().notEmpty().withMessage(Messages.TASK_EMPTY_DESCRIPTION),
        body("completed").isBoolean({ strict: true }).withMessage(Messages.TASK_INVALID_COMPLETED)
    ];
}