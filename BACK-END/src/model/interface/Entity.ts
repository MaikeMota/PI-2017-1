import { Instance } from 'sequelize';
import * as SequelizeStatic from 'sequelize';

export interface Entity<T extends EntityAttributes> extends Instance<T> {
    dataValues: T;
}

export interface EntityAttributes {
    id: string;
    active: boolean,
    createdAt: Date,
    updatedAt: Date
}
