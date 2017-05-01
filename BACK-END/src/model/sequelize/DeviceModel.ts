import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { User, UserAttributes, Device, DeviceAttributes, WaterInLetOpenTrigger, WaterInLetCloseTrigger } from '../interface/';

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<Device, DeviceAttributes> {
    let device = sequelize.define<Device, DeviceAttributes>('Device', {
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
            getterMethods: {
                deviceKey: () => { return this.getDataValue('device_key') },
                minWaterLevel: () => { return this.getDataValue('min_water_level') },
                medWaterLevel: () => { return this.getDataValue('med_water_level') },
                maxWaterLevel: () => { return this.getDataValue('max_water_level') },
                recipientRadius: () => { return this.getDataValue('device_key') },
                recipientHeight: () => { return this.getDataValue('device_key') },
                waterInletOpenTrigger: () => {
                    return WaterInLetOpenTrigger.parse(this.getDataValue('water_inlet_open_trigger'))
                },
                waterInletCloseTrigger: () => {
                    return WaterInLetCloseTrigger.parse(this.getDataValue('water_inlet_close_trigger'))
                }
            },
            setterMethods: {
                deviceKey: (deviceKey: string) => { this.setDataValue('device_key', deviceKey) },
                minWaterLevel: (value: number) => { this.setDataValue('min_water_level', value) },
                medWaterLevel: (value: number) => { this.setDataValue('med_water_level', value) },
                maxWaterLevel: (value: number) => { this.setDataValue('max_water_level', value) },
                recipientRadius: (value: number) => { this.setDataValue('device_key', value) },
                recipientHeight: (value: number) => { this.setDataValue('device_key', value) },
                waterInletOpenTrigger: (trigger: WaterInLetOpenTrigger) => {
                    this.setDataValue('water_inlet_open_trigger', trigger.name)
                },
                waterInletCloseTrigger: (trigger: WaterInLetCloseTrigger) => {
                    this.setDataValue('water_inlet_close_trigger', trigger.name);
                }
            }
        }
    );

    return device;
}