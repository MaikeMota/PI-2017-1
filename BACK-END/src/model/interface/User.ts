import { EntityInstance } from './EntityInstance';
import { Entity } from '../../../../RETHINK/core';

export interface UserInstance extends EntityInstance<User> {
}

export class User extends Entity {

    constructor() {
        super();
    }
    
    username: string;
    password: string;
}