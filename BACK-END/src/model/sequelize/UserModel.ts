import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { User, UserAttributes } from '../interface/User';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<User, UserAttributes> {
    let user = sequelize.define<User, UserAttributes>('User', {
        username: {
            type: dataTypes.STRING,
            allowNull: false
        },
        password: {
            type: dataTypes.STRING
        },
        active: {
            type: dataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
            indexes: [
                { unique: true, fields: ['username'] }
            ],
            classMethods: {},
            tableName: "user",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",

        }
    );

    return user;
}