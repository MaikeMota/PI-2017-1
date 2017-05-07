import { RTKException } from './RTKException';

export class UnprocessableEntityException extends RTKException {

    constructor(developerMessage: string, code: number) {
        super(developerMessage, code, 422);
    }

}