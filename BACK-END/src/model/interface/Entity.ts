import { Instance } from 'sequelize';
import * as SequelizeStatic from 'sequelize';

export interface EntityInstance<T extends Entity> extends Instance<T> {
    dataValues: T;
}

export abstract class Entity {

    constructor() {
    }

    id: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
