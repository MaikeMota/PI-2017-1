import { Instance } from 'sequelize';
import * as sequelize from 'sequelize';

export interface Entity<T extends EntityAttributes> extends Instance<T> {
    dataValues: T;
}

export interface EntityAttributes {
    id: string;
    active: boolean
}