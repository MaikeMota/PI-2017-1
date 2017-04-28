import { Request, Response, NextFunction } from 'express';
import { RTKException, BadRequestException, ForbiddenException, ServerErrorException, UnregisteredModelException } from '../core/exception';
import { ResponseUtil, ObjectUtil } from '../util';

export class ErrorHandler {


    public static handler(error: Error | RTKException, request: Request, response: Response, next: NextFunction) {
        ErrorHandler.handleError(response, error);
    }

    public static handleError(response: Response, error: Error | RTKException): void {// TODO Register Expected Errors
        switch (error.constructor.name) {
            case BadRequestException.name: {
                ResponseUtil.badRequest(response, ObjectUtil.cast<BadRequestException>(error));
                break;
            }
            case ForbiddenException.name: {
                ResponseUtil.forbidden(response, ObjectUtil.cast<ForbiddenException>(error));
                break;
            }
            default: {
                ResponseUtil.serverError(response, new ServerErrorException("An unexpected error occurred.", -1));
                if ((error as ServerErrorException).developerMessage) {
                    console.log(`[Server Fault] - [${new Date()}] - ${(error as ServerErrorException).developerMessage}`);
                }
                if ((error as Error).stack) {
                    console.log((error as Error).stack);
                }
                break;
            }
        }
    }
}