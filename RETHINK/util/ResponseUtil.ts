import { Response } from 'express';
import {
    RTKException, ForbiddenException, BadRequestException, ServerErrorException, EntityNotFoundException,
    UnprocessableEntityException
} from '../core/exception';

export abstract class ResponseUtil {

    public static produceResponse(response: Response, error: RTKException): void {
        response.statusCode = error.statusCode;
        response.json(error);
    }
}