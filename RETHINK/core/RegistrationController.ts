import { Entity } from './Entity';
import { AbstractController } from './AbstractController';

export abstract class RegistrationController<T extends Entity> extends AbstractController<T> {

    constructor() {
        super();
    }
    
    abstract create(): Promise<any>;
    abstract update(): Promise<any>;
    abstract delete(): Promise<any>;
}