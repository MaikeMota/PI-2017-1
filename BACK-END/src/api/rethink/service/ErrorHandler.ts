import { Request, Response, NextFunction } from 'express';
import { RTKException, BadRequestException, ForbiddenException, ServerErrorException } from '../core';
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
                ResponseUtil.serverError(response, ObjectUtil.cast<ServerErrorException>(error));
                break;
            }
        }
    }
}