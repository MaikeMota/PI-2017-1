import { EntityInstance, Entity } from './Entity';

export interface UserInstance extends EntityInstance<User> {
}

export class User extends Entity {

    constructor() {
        super();
    }
    username: string;
    password: string;
}