import { Device, DeviceInstance } from "../model/interface/";
import { DeviceDao } from "../../database/DeviceDao";
import { EntityService } from "./";
import { StringUtil } from "../../../RETHINK/util";

export class DeviceService extends EntityService<Device> {

    public byDeviceKey(device_key: string): Promise<Device> {
        return this.dao.byDeviceKey(device_key);
    }

    public save(entity: Device): Promise<Device> {
        entity.device_key = StringUtil.randomString(25);
        return super.dao.save(this.class, entity);
    }

    public deviceConfig(device_key: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.dao.byDeviceKey(device_key).then((device) => {
                resolve(Device.extractConfig(device));
            }).catch(error => {
                reject(error);
            });
        });
    }

    protected get class(): new () => Device {
        return Device;
    }

    protected get dao(): DeviceDao {
        return DeviceDao.instance<DeviceDao>();
    }

}