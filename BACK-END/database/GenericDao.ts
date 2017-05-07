import { SequelizeDataBase } from './SequelizeDataBase';
import { Entity, EntityInstance } from '../src/model/interface';
import * as SequelizeStatic from 'sequelize';
import { EntityNotFoundException } from "../src/api/rethink/core/exception/index";

export class GenericDao<EI extends EntityInstance<E>, E extends Entity> {

    private static _instance: GenericDao<any, any>;

    public static instance<E extends GenericDao<any, any>>(): E {
        if (!this._instance) {
            this._instance = new this();
        }
        return <E>this._instance;
    }

    public save(classConstructor: new () => E, entity: E): Promise<E> {
        return new Promise<E>((resolve, reject) => {
            this.getModelForEntity(classConstructor).create(entity).then(savedInstance => {
                resolve(entity = savedInstance.dataValues);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public update(classConstructor: new () => E, entity: E): Promise<E> {
        return new Promise<E>((resolve, reject) => {
            this.getModelForEntity(classConstructor).find({
                where: {
                    id: entity.id
                }
            }).then((entityRegister) => {
                entityRegister.updateAttributes(entity).then(() => {
                    resolve(entity = entityRegister.dataValues)
                });
            }).catch(error => {
                reject(error);
            })
        });
    }

    public delete(classConstructor: new () => E, entity: E): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getModelForEntity(classConstructor).destroy({
                where: {
                    id: entity.id
                }
            }).then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            })
        });
    }

    public byId(classConstructor: new () => E, id: string): Promise<E> {
        return new Promise<E>((resolve, reject) => {
            this.getModelForEntity(classConstructor).findByPrimary(id).then((entity) => {
                if (entity) {
                    resolve(entity.dataValues);
                } else {
                    throw new EntityNotFoundException(`Cannot find a register for the class '${(classConstructor as Function).name}' with id '${id}'`, -1);
                }
            }).catch(error => { reject(error) });
        });
    }

    public list(classConstructor: new () => E, offset: number = 0, limit: number = 10): Promise<E[]> {
        return new Promise<E[]>((resolve, reject) => {
            this.getModelForEntity(classConstructor).findAll({
                where: {
                    active: true
                },
                offset: offset,
                limit: limit
            }).then((results) => {
                let entities: E[] = [];
                results.forEach((instance) => {
                    entities.push(instance.dataValues);
                });
                resolve(entities);
            })
        });
    }

    protected getModelForEntity(classConstructor: new () => E): SequelizeStatic.Model<EI, E> {
        return SequelizeDataBase.instance.getModel<EI, E>(classConstructor);
    }
}