import express, { Application } from "express";
import dotenvConfig from "dotenv/config";
import cors from "cors";
import { initializeApp as initializeAdminApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase/app";
import { attachControllers } from "@decorators/express";
import { AuthController } from "@controllers/auth-controller";
import { UsersController } from "@controllers/users-controller";
import { TasksController } from "@controllers/tasks-controller";
import serverless from "serverless-http";
dotenvConfig;


class Api {
    api: Application;
    private app: Application;

    constructor() {
        this.firebaseAdminSetup();
        this.firebaseSetup();
        this.app = express();
        this.api = express();
        this.config();
    }

    private firebaseAdminSetup() {
        initializeAdminApp({ credential: cert(require("../../../serviceAccountKey.json")) });
        getFirestore().settings({ timestampsInSnapshots: true });
    }

    private firebaseSetup() {
        initializeApp({
            apiKey: process.env.fbc_apiKey
        });
    }

    private async config() {
        this.app.use([
            cors(),
            express.json(),
            express.urlencoded({ extended: true })
        ]);
        await attachControllers(this.app, [AuthController, UsersController, TasksController]);
        this.api.use('/api', this.app);
    }
}

const nodeAPI = new Api();
export const handler = serverless(nodeAPI.api);
