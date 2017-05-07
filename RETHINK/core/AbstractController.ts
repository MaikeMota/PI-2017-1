import { Entity } from './Entity';

export abstract class AbstractController<T extends Entity> {
    public entity: T;
    public busy: boolean;

    constructor() {
        this.clean();
    }

    abstract clean();
}