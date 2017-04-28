import { Router } from 'express';

export abstract class BaseRouter {

    private _router: Router;

    public get router(): Router {
        if (!this._router) {
            this._router = Router();
            this.configureMiddleware();
            this.configureRouter();
        }
        return this._router;
    }

    protected abstract configureRouter(): void;
    
    protected configureMiddleware(): void {

    }

    protected register<T extends BaseRouter>(rootPath: string, routerConfigurationConstructor: new () => T) {
        let configuration = new routerConfigurationConstructor();
        this.router.use(`/${rootPath}`, configuration.router);
    }
}