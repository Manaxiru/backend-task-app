import express, { Application } from "express";
import dotenvConfig from "dotenv/config";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { attachControllers } from "@decorators/express";
import serverless from "serverless-http";
dotenvConfig;


class Api {
    api: Application;
    private app: Application;

    constructor() {
        this.firebaseSetup();
        this.app = express();
        this.api = express();
        this.config();
    }

    private firebaseSetup() {
        initializeApp({ credential: cert(require("../../../serviceAccountKey.json")) });
        getFirestore().settings({ timestampsInSnapshots: true });
    }

    private async config() {
        this.app.use([
            cors(),
            express.json(),
            express.urlencoded({ extended: true })
        ]);
        await attachControllers(this.app, []);
        this.api.use('/api', this.app);
    }
}

const nodeAPI = new Api();
export const handler = serverless(nodeAPI.api);
