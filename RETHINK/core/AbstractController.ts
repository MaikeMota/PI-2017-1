import { Entity } from './Entity';
import { RTKObject } from './RTKObject';

export abstract class AbstractController<T extends Entity> extends RTKObject {
    public entity: T;
    public busy: boolean;

    constructor() {
        super();
        this.clean();
    }

    abstract clean();
}