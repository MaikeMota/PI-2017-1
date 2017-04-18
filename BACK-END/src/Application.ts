import * as express from 'express';
import * as process from 'process';
import * as morgan from 'morgan';

import { BaseRouter } from './router/BaseRouter';
import { ApiRouter } from './router/ApiRouter';
import { CalculatorRouter } from './router/CalculatorRouter';

export class Application {

    private app: express.Express;

    constructor(port: number) {
        this.initializeServer(port);
    }

    private initializeServer(port: number) {
        this.app = express();
        this.configureMiddlewares();
        this.configureRouter();
        let instance: Application = this;
        this.app.listen(port, "0.0.0.0", () => {
            console.log(`Server running at ${port}`);
        });
    }

    private configureMiddlewares() {
        this.app.use(morgan("dev"));
    }

    private configureRouter() {
        this.register("api", ApiRouter);
        this.register("calculator", CalculatorRouter);
    }

    private register<T extends BaseRouter>(rootPath: string, routerConfigurationConstructor: new () => T) {
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