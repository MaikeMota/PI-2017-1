import * as Sequelize from 'sequelize';
import { SequelizeInstance } from './SequelizeInstance';

export class SequelizeInitializer {

    public static intialize() {
        var sequelize = new Sequelize('database', 'system', 'master1234MASTER!@#$', {
            host: 'localhost',
            dialect: 'sqlite',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

            // SQLite only
            storage: './database/storage.db'
        });


        SequelizeInstance.UserModel = sequelize.define('user', {
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            }
        });

        // force: true will drop the table if it already exists
        SequelizeInstance.UserModel.sync({ force: false }).then(() => {
            // Table created
            return SequelizeInstance.UserModel.create({
                username: 'system',
                password: 'system1234SYSTEM!@#$'
            });
        });
    }
}