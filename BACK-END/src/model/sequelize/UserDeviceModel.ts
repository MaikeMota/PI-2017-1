import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { UserDevice, UserDeviceInstance } from '../interface/';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<UserDeviceInstance, UserDevice> {
    let userDevice = sequelize.define<UserDeviceInstance, UserDevice>('UserDevice', {
        active: {
            type: dataTypes.BOOLEAN
        }
    }, {
            indexes: [
            ],
            classMethods: {},
            tableName: "user_device",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    userDevice['associate'] = (models: SequelizeModels) => {
        models['User'].belongsToMany(models['Device'], {
            as: 'devices',
            through: userDevice,
            foreignKey: 'user_id'
        });
        models['Device'].belongsToMany(models['User'], {
            as: 'users',
            through: userDevice,
            foreignKey: 'device_id'
        });
    }
    return userDevice;
}