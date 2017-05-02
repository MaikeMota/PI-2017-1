import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';
import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { User, UserAttributes, Device, DeviceAttributes } from "../interface";

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<User, UserAttributes> {
    let user = sequelize.define<User, UserAttributes>('User', {
        username: {
            type: dataTypes.STRING,
            allowNull: false
        }, active: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        password: {
            type: dataTypes.STRING
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