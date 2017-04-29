import { ServerErrorException } from './ServerErrorException';

export class UnregisteredModelException extends ServerErrorException {

    constructor(developerMessage: string, errorCode: number) {
        super(developerMessage, errorCode);
    }

}