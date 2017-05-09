import { Router } from 'express';

export abstract class BaseRouter {

    public static readonly PATH: string;

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

    protected register<T extends BaseRouter>(routerConstructor: new () => T) {
        let router = new routerConstructor();
        this.router.use(`/${router.PATH}`, router.router);
    }

    public abstract get PATH(): string;
}