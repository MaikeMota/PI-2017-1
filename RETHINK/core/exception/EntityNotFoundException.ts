import { RTKException } from './RTKException';

export class EntityNotFoundException extends RTKException {

    constructor(developerMessage: string, code: number) {
        super(developerMessage, code, 404);
    }

}