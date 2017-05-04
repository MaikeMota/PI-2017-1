import { BadRequestException } from './BadRequestException';

export class EntityNotFoundException extends BadRequestException {

    constructor(developerMessage: string, code: number) {
        super(developerMessage, code);
    }

}