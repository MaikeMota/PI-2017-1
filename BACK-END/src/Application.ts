import * as express from 'express';
import * as process from 'process';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { BaseRouter } from './router/BaseRouter';
import { PublicApiRouter } from './router/PublicApiRouter';
import { CalculatorRouter } from './router/CalculatorRouter';
import { SequelizeInitializer } from '../database/SequelizeInitializer';
import { ErrorHandler } from "./api/rethink/service/ErrorHandler";

export class Application {

    private app: express.Express;

    constructor(port: number) {
        this.initializeServer(port);
        SequelizeInitializer.intialize();
    }

    private initializeServer(port: number): void {
        this.app = express();
        this.configureMiddlewares();
        this.configureRouter();
        this.configureErrorHandler();
        let instance: Application = this;
        this.app.listen(port, "0.0.0.0", () => {
            console.log(`Server running at ${port}`);
        });
    }

    private configureMiddlewares(): void {
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }

    private configureRouter(): void {
        this.register("api", PublicApiRouter);
        this.register("calculator", CalculatorRouter);
    }

    private configureErrorHandler(): void {
        this.app.use(ErrorHandler.handler);
    }

    private register<T extends BaseRouter>(rootPath: string, routerConfigurationConstructor: new () => T): void {
        let configuration = new routerConfigurationConstructor();
        this.app.use(`/${rootPath}`, configuration.router);
    }

    public static run(port: number | string): Application {
        if (typeof port == 'string') {
            port = parseInt(port.replace(/\D/, ""));
        }
        return new Application(port);
    }

}

Application.run(process.env.PORT || 3000);