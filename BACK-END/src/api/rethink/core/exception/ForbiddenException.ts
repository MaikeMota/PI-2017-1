import { RTKException } from './RTKException';

export class ForbiddenException extends RTKException {

    constructor(developerMessage: string, code: number) {
        super(developerMessage, code, 403);
    }

}