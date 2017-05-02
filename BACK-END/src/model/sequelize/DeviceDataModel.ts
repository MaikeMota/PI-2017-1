import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { DeviceData, DeviceInstance } from '../interface/';
import { StringUtil } from "../../api/rethink/util/";

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<DeviceInstance, DeviceData> {
    let deviceData = sequelize.define<DeviceInstance, DeviceData>('DeviceData', {
        water_level: {
            type: dataTypes.FLOAT,
            allowNull: false
        },
        water_inlet_flux: {
            type: dataTypes.FLOAT,
            allowNull: false
        },
        water_out_flux: {
            type: dataTypes.FLOAT,
            allowNull: false
        }
    }, {
            indexes: [
            ],
            classMethods: {
            },
            tableName: "device_data",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            getterMethods: {
                waterLevel: () => { return this.getDataValue('water_level') },
                waterInletFlux: () => { return this.getDataValue('water_inlet_flux') },
                waterOutFlux: () => { return this.getDataValue('water_out_flux') }
            },
            setterMethods: {
                waterLevel: (value: number) => { return this.setDataValue('water_level', value) },
                waterInletFlux: (value: number) => { return this.setDataValue('water_inlet_flux', value) },
                waterOutFlux: (value: number) => { return this.setDataValue('water_out_flux', value) }

            }
        }
    );

    deviceData['associate'] = (models: SequelizeModels) => {
        deviceData.belongsTo(models['Device'], {
            as: 'device',
            foreignKey: 'device_id'
        });
    }

    return deviceData;
}