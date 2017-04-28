import { RTKException } from './RTKException';

export class BadRequestException extends RTKException {

    constructor(developerMessage: string, code: number) {
        super(developerMessage, code, 400);
    }

}