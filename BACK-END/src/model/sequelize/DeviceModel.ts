import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { User, UserInstance, Device, DeviceInstance, WaterInLetOpenTrigger, WaterInLetCloseTrigger } from '../interface/';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<DeviceInstance, Device> {
    let device = sequelize.define<DeviceInstance, Device>('Device', {
        device_key: {
            type: dataTypes.STRING,
            allowNull: false

        },
        description: {
            type: dataTypes.STRING,
            allowNull: false
        },
        min_water_level: {
            type: dataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        med_water_level: {
            type: dataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        max_water_level: {
            type: dataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        recipient_radius: {
            type: dataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        recipient_height: {
            type: dataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        water_inlet_open_trigger: {
            type: dataTypes.ENUM(WaterInLetOpenTrigger.valuesAsString()),
            allowNull: false
        },
        water_inlet_close_trigger: {
            type: dataTypes.ENUM(WaterInLetCloseTrigger.valuesAsString()),
            allowNull: false
        }
    }, {
            indexes: [
                { unique: true, fields: ['device_key'] }
            ],
            classMethods: {},
            tableName: "device",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return device;
}