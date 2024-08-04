import {
    Controller,
    Req,
    Body,
    Params,
    Response,
    Get,
    Post,
    Put,
    Delete
} from "@decorators/express";
import { body, param, ValidationChain, validationResult } from "express-validator";
import { TasksRepository } from "@repository/tasks-repository";
import { Auth } from "@middleware/auth";
import { Timestamp } from "firebase-admin/firestore";
import { BackendModules, Messages } from "@shared/enums";
import { ITypedResponse, ITypedRequestBody, IUsers, ITask, ITypedRequest, ITypedRequestQuery } from "@shared/interfaces";
import { InternalRoutes } from "@shared/constants";


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

            let task: Partial<ITask> = { ...body, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };

            if (!checkUserTask)
                await this.taskRepository
                    .createWithId(res.locals.user.uid, { email: res.locals.user.email, createdAt: Timestamp.now() })
                    .then(async () => task = { id: (await this.taskRepository.createSubcollection(res.locals.user.uid, task)).id, ...task });
            else
                task = { id: (await this.taskRepository.createSubcollection(res.locals.user.uid, task)).id, ...task };

            return res.status(201).json({
                data: { ...task, createdAt: task.createdAt?.toMillis(), updatedAt: task.updatedAt?.toMillis() },
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
            const tasksSnapshot = await this.taskRepository.readAllSubcollection(res.locals.user.uid);

            const tasks: ITask[] = [];

            if (!tasksSnapshot.empty) {
                tasksSnapshot.forEach(taskDoc =>
                    tasks.push({ id: taskDoc.id, ...taskDoc.data(), createdAt: taskDoc.data().createdAt?.toMillis(), updatedAt: taskDoc.data().updatedAt?.toMillis() } as ITask)
                );
            }

            return res.status(200).json({ data: tasks, count: tasks.length, success: true, message: "" });
        } catch (err) {
            return res.status(500).json({ data: err, success: false, message: Messages.ERROR });
        }
    }

    @Put(`/:${InternalRoutes.TASKS.ID}`, [
        param(InternalRoutes.TASKS.ID).isAlphanumeric().withMessage(Messages.TASK_INVALID_ID),
        ...taskValidations(true)
    ])
    async update(@Req() req: ITypedRequest<Pick<ITask, "id">, Pick<ITask, "title" | "description" | "completed">>, @Params(InternalRoutes.TASKS.ID) id: Pick<ITask, "id">, @Response() res: ITypedResponse<ITask>) {
        try {
            if (!validationResult(req).isEmpty()) {
                const errorsMessages = validationResult(req).array().map(x => x.msg);
                return res.status(400).json({ success: false, message: errorsMessages.length > 1 ? errorsMessages : errorsMessages[0] });
            }

            let task: Partial<ITask> = { id: id as unknown as string };

            await this.taskRepository.updateSubcollection(res.locals.user.uid, task.id!, { ...req.body, updatedAt: Timestamp.now() })
                .then(async () => task = { ...task, ...(await this.taskRepository.readOneSubcollection(res.locals.user.uid, task.id!)).data() })
                .catch(err => {
                    return res.status(400).json({ data: err, success: false, message: Messages.TASK_INVALID_UPDATED });
                });

            return res.status(200).json({
                data: { ...task, createdAt: task.createdAt?.toMillis(), updatedAt: task.updatedAt?.toMillis() },
                success: true,
                message: Messages.TASK_UPDATED
            });
        } catch (err) {
            return res.status(500).json({ data: err, success: false, message: Messages.ERROR });
        }
    }

    @Delete(`/:${InternalRoutes.TASKS.ID}`, [param(InternalRoutes.TASKS.ID).isAlphanumeric().withMessage(Messages.TASK_INVALID_ID)])
    async delete(@Req() req: ITypedRequestQuery<Pick<ITask, "id">>, @Params(InternalRoutes.TASKS.ID) id: Pick<ITask, "id">, @Response() res: ITypedResponse<ITask>) {
        try {
            if (!validationResult(req).isEmpty()) return res.status(400).json({ success: false, message: Messages.TASK_INVALID_ID });

            await this.taskRepository.deleteSubcollection(res.locals.user.uid, id as unknown as string)
                .catch(err => {
                    return res.status(400).json({ data: err, success: false, message: Messages.TASK_INVALID_DELETED });
                });

            return res.status(200).json({ success: true, message: Messages.TASK_DELETED });
        } catch (err) {
            return res.status(500).json({ data: err, success: false, message: Messages.ERROR });
        }
    }
}

function taskValidations(optional: boolean = false): ValidationChain[] {
    if (!optional)
        return [
            body("title").isString().withMessage(Messages.TASK_INVALID_TITLE).bail().trim().notEmpty().withMessage(Messages.TASK_EMPTY_TITLE),
            body("description").isString().withMessage(Messages.TASK_INVALID_DESCRIPTION).bail().trim().notEmpty().withMessage(Messages.TASK_EMPTY_DESCRIPTION),
            body("completed").isBoolean({ strict: true }).withMessage(Messages.TASK_INVALID_COMPLETED)
        ];
    else
        return [
            body("title").isString().withMessage(Messages.TASK_INVALID_TITLE).bail().trim().notEmpty().withMessage(Messages.TASK_EMPTY_TITLE).optional({ values: "undefined" }),
            body("description").isString().withMessage(Messages.TASK_INVALID_DESCRIPTION).bail().trim().notEmpty().withMessage(Messages.TASK_EMPTY_DESCRIPTION).optional({ values: "undefined" }),
            body("completed").isBoolean({ strict: true }).withMessage(Messages.TASK_INVALID_COMPLETED).optional({ values: "undefined" })
        ];
}