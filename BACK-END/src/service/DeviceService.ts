import { Device, DeviceInstance } from "../model/interface/";
import { DeviceDao } from "../../database/DeviceDao";
import { EntityService } from "./";
import { StringUtil } from "../../../RETHINK/util";

export class DeviceService extends EntityService<Device> {

    public byDeviceKey(deviceKey: string): Promise<Device> {
        return this.dao.byDeviceKey(deviceKey);
    }

    public save(entity: Device): Promise<Device> {
        entity.device_key = StringUtil.randomString(25);
        return super.dao.save(this.class, entity);
    }

    protected get class(): new () => Device {
        return Device;
    }

    protected get dao(): DeviceDao {
        return DeviceDao.instance<DeviceDao>();
    }

}