import { sequelizeDB } from './SequelizeDataBase';
import { Entity, EntityInstance } from '../src/model/interface';
import * as SequelizeStatic from 'sequelize';

export class GenericDao<T extends EntityInstance<E>, E extends Entity> {


    public save(entity: E): Promise<E> {
        return new Promise<E>((resolve, reject) => {
            this.resolveModelForEntity(entity).create(entity).then(savedInstance => {
                resolve(savedInstance.dataValues);
            }).catch(error => {
                reject(error);
            });
        });
    }

    private resolveModelForEntity(entity: E): SequelizeStatic.Model<T, E> {
        return sequelizeDB.getModel<T, E>((entity as Object).constructor.name);
    }
}

export var GenericDaoInstance = new GenericDao();