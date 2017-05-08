import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeModels } from '../../../database/SequelizeDataBase';

import { DeviceDataEvent, DeviceDataEventInstance } from '../interface/';
import { DeviceDataEventEnum } from "../DeviceEventEnum";

export default function (sequelize: Sequelize, dataTypes: DataTypes): SequelizeStatic.Model<DeviceDataEventInstance, DeviceDataEvent> {
    let deviceDataEvent = sequelize.define<DeviceDataEventInstance, DeviceDataEvent>('DeviceDataEvent', {
        event: {
            type: dataTypes.ENUM(DeviceDataEventEnum.valuesAsString()),
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

    return deviceDataEvent;
}