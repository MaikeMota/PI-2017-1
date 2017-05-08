import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { DeviceData, DeviceDataInstance } from '../interface/';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<DeviceDataInstance, DeviceData> {
    let deviceData = sequelize.define<DeviceDataInstance, DeviceData>('DeviceDataEvent', {
        water_level: {
            type: dataTypes.NUMBER,
            allowNull: false
        },
        water_inlet_flux: {
            type: dataTypes.NUMBER,
            allowNull: false
        },
        water_out_flux: {
            type: dataTypes.NUMBER,
            allowNull: false
        }
    }, {
            indexes: [
                // { unique: true, fields: ['Devicename'] }
            ],
            classMethods: {},
            tableName: "device_data_event",
            timestamps: false

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