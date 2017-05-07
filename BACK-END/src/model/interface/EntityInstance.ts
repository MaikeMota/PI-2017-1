import { Instance } from 'sequelize';
import * as SequelizeStatic from 'sequelize';
import { Entity } from '../../../../RETHINK/core';

export interface EntityInstance<T extends Entity> extends Instance<T> {
    dataValues: T;
}