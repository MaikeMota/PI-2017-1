import { SequelizeDataBase } from './SequelizeDataBase';
import { Entity, EntityInstance } from '../src/model/interface';
import * as SequelizeStatic from 'sequelize';

export class GenericDao {

    private static _instance: any;

    public static get instance(): GenericDao {
        if (!this._instance) {
            this._instance = new GenericDao();
        }
        return this._instance;
    }

    public save<T extends EntityInstance<E>, E extends Entity>(entity: E): Promise<E> {
        return new Promise<E>((resolve, reject) => {
            this.resolveModelForEntity(entity).create(entity).then(savedInstance => {
                resolve(savedInstance.dataValues);
            }).catch(error => {
                reject(error);
            });
        });
    }

    private resolveModelForEntity<T extends EntityInstance<E>, E extends Entity>(entity: E): SequelizeStatic.Model<T, E> {
        return SequelizeDataBase.instance.getModel<T, E>((entity as Object).constructor.name);
    }
}