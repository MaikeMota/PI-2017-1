import { GenericDao } from "./GenericDao";
import { Device, DeviceInstance } from "../src/model/interface";

export class DeviceDao extends GenericDao<DeviceInstance, Device> {

    public byDeviceKey(deviceKey: string): Promise<Device> {
        return new Promise<Device>((resolve, reject) => {
            this.getModelForEntity(Device).findByPrimary(deviceKey).then((result) => {
                resolve(result.dataValues);
            }).catch(error => {
                reject(error);
            });
        });
    }

    protected get class(): new () => Device {
        return Device;
    };

}