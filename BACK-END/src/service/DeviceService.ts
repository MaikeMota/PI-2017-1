

import { Device, DeviceInstance } from "../model/interface/";
import * as SequelizeStatic from "sequelize";
import { SequelizeDataBase } from "../../database/SequelizeDataBase";
import { EntityNotFoundException } from "../api/rethink/core/exception";

export class DeviceService {

    private static _instance: DeviceService;
    private db: SequelizeStatic.Model<DeviceInstance, Device>;

    public save(device: Device): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.insertOrUpdate(device).then((deviceinstance) => {
            }).catch(error => {
                reject(error);
            })
        });
    }

    public findById(deviceId: number): Promise<Device> {
        return new Promise<Device>((resolve, reject) => {
            this.db.findById(deviceId).then((device) => {
                if (device) {
                    resolve(device.dataValues);
                } else {
                    throw new EntityNotFoundException(`Cannot find entity with id: ${deviceId}`, -1);
                }

            }).catch(error => {
                reject(error);
            })
        });
    }

    public findByDeviceKey(deviceKey: number): Promise<Device> {
        return new Promise<Device>((resolve, reject) => {
            this.db.findByPrimary(deviceKey).then((device) => {
                if (device) {
                    resolve(device.dataValues);
                } else {
                    throw new EntityNotFoundException(`Cannot find entity with id: ${deviceKey}`, -1);
                }

            }).catch(error => {
                reject(error);
            })
        });
    }

    public static get instance(): DeviceService {
        if (!this._instance) {
            this._instance = new DeviceService();
            this._instance.db = SequelizeDataBase.instance.getModel<DeviceInstance, Device>('Device');;
        }
        return this._instance;
    }

}