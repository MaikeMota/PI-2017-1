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

    public constructor() {
    }

    private registerDefaultModels(): void {

        readdirSync('./src/model/sequelize').filter((file: string) => {
            return (file !== path.basename(module.filename) && (file !== "interface"));
        }).forEach((file: string) => {
            let model: SequelizeStatic.Model<Entity<EntityAttributes>, EntityAttributes> =
                this.sequelize.import<Entity<EntityAttributes>, EntityAttributes>(path.join('../src/model/sequelize', file));
            this._models[(model as any).name] = model;
        });

        /*

        This piece of code looks like are something with migration, but the class Model does not has the associate function. So, for now, it'll stay commented.        
        Object.keys(this._models).forEach((modelName: string) => {
            if (typeof this._models[modelName].associate === "function") {
                this._models[modelName].associate(this.models);
            }
            
        })*/

        Object.keys(this._models).forEach((modelName) => {
            this._models[modelName].sync({ force: false });
        });

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

        sequelizeDatabase.registerDefaultModels();

        sequelizeDB = sequelizeDatabase;
    }

    public getModel(modelName: string): SequelizeStatic.Model<Entity<EntityAttributes>, EntityAttributes> {
        let model = this._models[modelName];
        if (model) {
            return model;
        } else {
            throw new UnregisteredModelException(`The model '${modelName}' was not registered.`, -1);
        }
    }

    public get sequelize(): Sequelize {
        return this._sequelize;
    }
}

class SequelizeModels {
    [key: string]: SequelizeStatic.Model<Entity<EntityAttributes>, EntityAttributes>;
}

export var sequelizeDB: SequelizeDataBase;