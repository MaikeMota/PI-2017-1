import * as express from 'express';
import * as process from 'process';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { BaseRouter } from './router/BaseRouter';
import { PublicApiRouter } from './router/PublicApiRouter';
import { CalculatorRouter } from './router/CalculatorRouter';
import { ErrorHandler } from "./api/rethink/service/ErrorHandler";
import { StringUtil } from './api/rethink/util';
import { SequelizeDataBase, } from "../database/SequelizeDataBase";

export class Application {

    private app: express.Express;

    constructor(port: number) {
        this.initializeServer(port);
        SequelizeDataBase
            .registerSequelizeModelsFolder('./src/model/sequelize')
            .initializeDatabase();

    }

    private initializeServer(port: number): void {
        this.app = express();
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
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
        this.register(PublicApiRouter);
        this.register(CalculatorRouter);
    }

    private configureErrorHandler(): void {
        this.app.use(ErrorHandler.handler);
    }

    private register<T extends BaseRouter>(routerConstructor: new () => T): void {
        let route = new routerConstructor();
        this.app.use(`/${route.PATH}`, route.router);
    }

    public static run(port: number | string): Application {
        if (typeof port == 'string') {
            port = StringUtil.toInt(port);
        }
        return new Application(port);
    }

}

Application.run(process.env.PORT || 3000);