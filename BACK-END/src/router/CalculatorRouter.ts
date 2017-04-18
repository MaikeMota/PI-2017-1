import { Router, Request, Response, NextFunction } from 'express';
import { Calculator } from '../Calculator';


export class CalculatorRouter {

    private static _router: Router;

    public static get router(): Router {
        if (!CalculatorRouter._router) {
            CalculatorRouter._router = Router();
            this.configureRouter();
        }
        return CalculatorRouter._router;
    }

    private static configureRouter(): void {
        console.log('Config:CalculatorRouter');
        CalculatorRouter._router.get('/:a/:b', this.add);
    }

    private static add(request: Request, response: Response, next: NextFunction) {
        response.json({ result: Calculator.add(parseInt(request.params['a']), parseInt(request.params['b'])) })
    }
}

export default CalculatorRouter.router;