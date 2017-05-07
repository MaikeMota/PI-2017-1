import { Request, Response, NextFunction } from 'express';
import { RTKException, BadRequestException, ForbiddenException, ServerErrorException, UnregisteredModelException, EntityNotFoundException, UnprocessableEntityException } from '../core/exception';
import { ResponseUtil, ObjectUtil } from '../util';

export class ErrorHandler {


    public static handler(error: Error | RTKException, request: Request, response: Response, next: NextFunction) {
        ErrorHandler.handleError(response, error);
    }

    public static handleError(response: Response, error: Error | RTKException): void {// TODO Register Expected Errors
        if (error instanceof RTKException) {
            ResponseUtil.produceResponse(response, error);
        } else {
            ResponseUtil.produceResponse(response, new ServerErrorException("An unexpected error occurred.", -1));
            if ((error as any).developerMessage) {
                console.log(`[RTKException] - [${new Date()}] - ${(error as any).developerMessage}`);
            } else {
                console.error(`[Error] -[${new Date()}] - ${error.message}`);
                if ((error as any).errors) { // probally sequelize errors
                    for (let e of (error as any).errors) {
                        this.printStack(e);
                    }
                } else {
                    this.printStack(error);
                }
            }

        }
    }

    public static printStack(error: Error) {
        if ((error as Error).stack) {
            console.log((error as Error).stack);
        }
    }
}