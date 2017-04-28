import { Entity, EntityAttributes } from './Entity';

export interface User extends Entity<UserAttributes> {
}

export interface UserAttributes extends EntityAttributes {
    username: string;
    password: string;
}