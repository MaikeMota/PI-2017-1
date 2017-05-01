import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { DeviceData, DeviceDataAttributes } from '../interface/';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<DeviceData, DeviceDataAttributes> {
    let deviceData = sequelize.define<DeviceData, DeviceDataAttributes>('DeviceDataEvent', {

    }, {
            indexes: [
                // { unique: true, fields: ['Devicename'] }
            ],
            classMethods: {},
            tableName: "device_data_event",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",

        }
    );

    deviceData['associate'] = (models: SequelizeModels) => {
        deviceData.belongsTo(models['DeviceData'], {
            as: 'deviceData',
            foreignKey: 'device_data_id'
        });
    }

    return deviceData;
}