import { Entity } from '../../../../../RETHINK/core';

export class User extends Entity {

    constructor() {
        super();
    }
    
    username: string;
    password: string;
}