import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';


/**
 * Test Endpoint
 * 
 * This Endpoint just Echo the received message.
 */
export class EchoRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = 'echo';


    protected configureRouter(): void {
        this.router.get('/:echoMe', EchoRouter.GET);
        this.router.post('/', EchoRouter.POST);
    }

    public get PATH(): string {
        return EchoRouter.ROOT_PATH;
    }

    private static GET(request: Request, response: Response, next: NextFunction) {
        response.contentType('text');
        response.send(request.params['echoMe']);
    }

    private static POST(request: Request, response: Response, next: NextFunction) {
        if (!request.body) {
            return response.sendStatus(400);
        }
        response.contentType('text');
        response.send(request.body.echoMe, );
    }

}