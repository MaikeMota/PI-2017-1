import * as express from 'express';
import * as process from 'process';
import * as morgan from 'morgan';

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
        this.app.listen(port, () => {
            console.log(`Server running at ${port}`);
        });
    }

    private configureMiddlewares() {
        this.app.use(this.requestLogger);
        this.app.use(morgan("dev"));
    }

    private configureRouter() {
        this.app.use('/calculator', CalculatorRouter.router);
    }


    private requestLogger(request: express.Request, response: express.Response, next: express.NextFunction) {
        console.log(`request from ${request.connection.address().address}`);
        next();
    }

    public static run(port: number | string): Application {
        if (typeof port == 'string') {
            port = parseInt(port.replace(/\D/, ""));
        }
        return new Application(port);
    }

}

Application.run(process.env.PORT || 3000);