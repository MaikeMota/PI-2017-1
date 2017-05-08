import { GenericDao } from "./GenericDao";
import { Device, DeviceInstance } from "../src/model/interface";
import { EntityNotFoundException } from "../../RETHINK/core/exception/index";

export class DeviceDao extends GenericDao<DeviceInstance, Device> {

    public byDeviceKey(device_key: string): Promise<Device> {
        return new Promise<Device>((resolve, reject) => {
            this.getModelForEntity(Device).findOne({
                where: {
                    device_key: device_key
                }
            }).then((result) => {
                if (result) {
                    resolve(result.dataValues);
                } else {
                    throw new EntityNotFoundException(`Cannot find a device where device_key=${device_key}`, -1);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    protected get class(): new () => Device {
        return Device;
    };

}