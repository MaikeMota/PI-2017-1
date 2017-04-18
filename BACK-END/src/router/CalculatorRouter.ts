import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { Calculator } from '../service/Calculator';


export class CalculatorRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.get('/:a/:b', CalculatorRouter.add);
    }

    private static add(request: Request, response: Response, next: NextFunction) {
        response.json({ result: Calculator.add(parseInt(request.params['a']), parseInt(request.params['b'])) });
    }
}