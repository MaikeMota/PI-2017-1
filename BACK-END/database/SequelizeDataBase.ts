import { readdirSync } from 'fs';
import * as path from 'path';

import * as SequelizeStatic from 'sequelize';
import { Sequelize } from "sequelize";

import { UnregisteredModelException } from '../src/api/rethink/core/exception'
import { EntityInstance, Entity } from '../src/model/interface';

export class SequelizeDataBase {

    private _sequelize: Sequelize;
    private _models: SequelizeModels = new SequelizeModels();

    private static _modelsFolders: string[] = [];

    public constructor() {
    }

    private bindModels(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            for (let pathToRegister of SequelizeDataBase._modelsFolders) {

                readdirSync(pathToRegister).forEach((file: string) => {
                    let model: SequelizeStatic.Model<EntityInstance<Entity>, Entity> =
                        this.sequelize.import<EntityInstance<Entity>, Entity>(path.join('../', pathToRegister, file));
                    this._models[(model as any).name] = model;
                });

                Object.keys(this._models).forEach((modelName: string) => {
                    if (typeof this._models[modelName]['associate'] === "function") {
                        this._models[modelName]['associate'](this._models);
                    }
                });
            }

            let syncPromises = [];

            Object.keys(this._models).forEach((modelName) => {
                syncPromises.push(
                    this._models[modelName].sync({ force: false })
                );
            });

            Promise.all(syncPromises).then(() => {
                resolve()
            }).catch(error => {
                reject(error);
            });
        });

    }

    public getModel<T extends EntityInstance<E>, E extends Entity>(modelName: string): SequelizeStatic.Model<T, E> {
        let model = this._models[modelName];
        if (model) {
            return <SequelizeStatic.Model<T, E>>model;
        } else {
            throw new UnregisteredModelException(`The model '${modelName}' was not registered.`, -1);
        }
    }

    public get sequelize(): Sequelize {
        return this._sequelize;
    }

    public static initializeDatabase(): Promise<SequelizeDataBase> {
        return new Promise<SequelizeDataBase>((resolve, reject) => {
            let sequelizeDatabase = new SequelizeDataBase();
            sequelizeDatabase._sequelize = new SequelizeStatic('database', 'system', 'master1234MASTER!@#$', { // TODO Migrate to a config file
                host: 'localhost',
                dialect: 'sqlite',
                pool: {
                    max: 5,
                    min: 1,
                    idle: 10000
                },
                // SQLite only
                storage: './database/storage.db'
            });
            sequelizeDatabase.bindModels().then(() => {
                sequelizeDB = sequelizeDatabase;
                resolve(sequelizeDB);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public static registerSequelizeModelsFolder(path: string) {
        if (this._modelsFolders.indexOf(path) == -1) {
            SequelizeDataBase._modelsFolders.push(path);
        } else {
            console.warn(`The path '${path}' was registered before!`);
        }
        return this;
    }
}

export class SequelizeModels {
    [key: string]: SequelizeStatic.Model<any, any>;
}

export var sequelizeDB: SequelizeDataBase;