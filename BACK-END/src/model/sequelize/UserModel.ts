import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';
import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { User, UserInstance, Device, DeviceInstance } from "../interface";

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<UserInstance, User> {
    let user = sequelize.define<UserInstance, User>('User', {
        username: {
            type: dataTypes.STRING,
            allowNull: false
        },
        password: {
            type: dataTypes.STRING
        },
        active: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
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
            updatedAt: "updated_at"
        }
    );
    return user;
}