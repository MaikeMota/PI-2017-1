import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { Calculator } from '../service/Calculator';
import { SocketService } from '../service/SocketService';


export class CalculatorRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "calculator";

    protected configureRouter(): void {
        this.router.get('/:a/:b', CalculatorRouter.add);
        this.router.post('/:a', CalculatorRouter.test);
    }

    public get PATH(): string {
        return CalculatorRouter.ROOT_PATH;
    }

    private static add(request: Request, response: Response, next: NextFunction) {
        response.json({ result: Calculator.add(parseInt(request.params['a']), parseInt(request.params['b'])) });
    }

    private static test(request: Request, response: Response, next: NextFunction) {
        SocketService.instance.sendMessage(request.params['a']);
        response.json({ result: "Ok"});
    }
}