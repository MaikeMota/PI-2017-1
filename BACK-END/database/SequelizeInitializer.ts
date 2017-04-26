import * as Sequelize from 'sequelize';

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


        var User = sequelize.define('user', {
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            }
        });

        // force: true will drop the table if it already exists
        User.sync({ force: false }).then(() => {
            // Table created
            return User.create({
                username: 'system',
                password: 'system1234SYSTEM!@#$'
            });
        });

        User.findAll().then(function (users) {
            console.log(users)
        })

        console.log("Initialized with success");
    }
}