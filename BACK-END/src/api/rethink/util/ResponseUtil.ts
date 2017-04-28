import { Response } from 'express';
import { RTKException, ForbiddenException, BadRequestException, ServerErrorException } from '../core';

export abstract class ResponseUtil {

    public static forbidden(response: Response, error: ForbiddenException): void {
        response.statusCode = 403;
        response.json(error);
    }

    public static badRequest(response: Response, error: BadRequestException) {
        response.statusCode = 400;
        response.json(error);
    }

    public static serverError(response: Response, error: ServerErrorException) {
        response.statusCode = 500;
        response.json(error);
    }
}