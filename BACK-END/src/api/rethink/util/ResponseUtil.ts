import { Response } from 'express';
import { RTKException } from '../core/RTKException';

export class ResponseUtil {

    public static forbidden(response: Response, error: RTKException): void {
        response.statusCode = 403;
        response.json(error);
    }
}