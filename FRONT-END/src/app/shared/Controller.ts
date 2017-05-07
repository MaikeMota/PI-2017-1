import { Entity } from './Entity';

export abstract class Controller<T extends Entity> {
    public entity: T;
    public busy: boolean;

    constructor() {
        this.clean();
    }

    abstract clean();
}