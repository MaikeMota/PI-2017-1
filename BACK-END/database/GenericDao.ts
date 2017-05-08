import { SequelizeDataBase } from './SequelizeDataBase';
import { EntityInstance } from '../src/model/interface';
import { Entity } from '../../RETHINK/core';
import * as SequelizeStatic from 'sequelize';
import { EntityNotFoundException, UnprocessableEntityException } from "../../RETHINK/core/exception/";

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
                entity = savedInstance.dataValues;
                resolve(entity);
            }).catch((error) => {
                this.handleError(error, reject);
            });
        });
    }

    public update(classConstructor: new () => E, entity: E): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getModelForEntity(classConstructor).find({
                where: {
                    id: entity.id
                }
            }).then((entityRegister) => {
                entityRegister.updateAttributes(entity).then(() => {
                    resolve();
                });
            }).catch((error) => {
                this.handleError(error, reject);
            });
        });
    }

    public delete(classConstructor: new () => E, id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getModelForEntity(classConstructor).destroy({
                where: {
                    id: id
                }
            }).then(() => {
                resolve();
            }).catch((error) => {
                this.handleError(error, reject);
            });
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
            }).catch((error) => {
                this.handleError(error, reject);
            });
        });
    }

    public list(classConstructor: new () => E, offset: number = 0, limit: number = 10): Promise<E[]> {
        return new Promise<E[]>((resolve, reject) => {
            this.getModelForEntity(classConstructor).findAll({
                offset: offset,
                limit: limit
            }).then((results) => {
                let entities: E[] = [];
                results.forEach((instance) => {
                    entities.push(instance.dataValues);
                });
                resolve(entities);
            }).catch((error) => {
                this.handleError(error, reject);
            });
        });
    }

    public count(classConstructor: new () => E): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.getModelForEntity(classConstructor).count().then((totalResults) => {
                resolve(totalResults);
            }).catch((error) => {
                this.handleError(error, reject);
            });
        });
    }

    protected getModelForEntity(classConstructor: new () => E): SequelizeStatic.Model<EI, E> {
        return SequelizeDataBase.instance.getModel<EI, E>(classConstructor);
    }

    public handleError(error, reject: (error) => void): void {
        let errorMessage: string = "";
        if ((error as any).errors) { // sequelize errors
            for (let e of (error as any).errors) {
                errorMessage += `${e.type} - ${e.message}. `;
            }
            reject(new UnprocessableEntityException(errorMessage, -1));
        } else {
            reject(error);
        }
    }
}