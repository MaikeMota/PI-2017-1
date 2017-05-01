import { readdirSync } from 'fs';
import * as path from 'path';

import * as SequelizeStatic from 'sequelize';
import { Sequelize } from "sequelize";

import { UnregisteredModelException } from '../src/api/rethink/core/exception'

import { User, UserAttributes } from '../src/model/interface';
import { Entity, EntityAttributes } from '../src/model/interface';

export class SequelizeDataBase {

    private _sequelize: Sequelize;
    private _models: SequelizeModels = new SequelizeModels();

    private static _modelsFolders: string[] = [];

    public constructor() {
    }

    private bindModels(): void {

        for (let pathToRegister of SequelizeDataBase._modelsFolders) {

            readdirSync(pathToRegister)/*.filter((file: string) => {
                return (file !== path.basename(module.filename) && (file !== "interface"));
            })*/
                .forEach((file: string) => {
                    let model: SequelizeStatic.Model<Entity<EntityAttributes>, EntityAttributes> =
                        this.sequelize.import<Entity<EntityAttributes>, EntityAttributes>(path.join('../', pathToRegister, file));
                    this._models[(model as any).name] = model;
                });
            Object.keys(this._models).forEach((modelName: string) => {
                if (typeof this._models[modelName]['associate'] === "function") {
                    this._models[modelName]['associate'](this._models);
                }
            })
        }

        Object.keys(this._models).forEach((modelName) => {
            this._models[modelName].sync({ force: true });
        });

    }

    public getModel<T extends Entity<E>, E extends EntityAttributes>(modelName: string): SequelizeStatic.Model<T, E> {
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

    public static initializeDatabase() {
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

        sequelizeDatabase.bindModels();

        sequelizeDB = sequelizeDatabase;
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