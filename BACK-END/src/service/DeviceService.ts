import { Device, DeviceInstance } from "../model/interface/";
import { DeviceDao } from "../../database/DeviceDao";
import { EntityService } from "./";

export class DeviceService extends EntityService<Device> {

    public byDeviceKey(deviceKey: string): Promise<Device> {
        return this.dao.byDeviceKey(deviceKey);
    }

    protected get class(): new () => Device {
        return Device;
    }

    protected get dao(): DeviceDao {
        return DeviceDao.instance<DeviceDao>();
    }

}