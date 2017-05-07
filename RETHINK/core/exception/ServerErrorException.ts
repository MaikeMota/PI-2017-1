import { RTKException } from './RTKException';

export class ServerErrorException extends RTKException {

    constructor(developerMessage: string, code: number) {
        super(developerMessage, code, 500);
    }

}