import { Device, DeviceInstance } from "../model/interface/";
import { EntityService } from "./";
import { StringUtil } from "../../../RETHINK/util";
import { DeviceDataDao } from "../../database";

export class DeviceDataService extends EntityService<Device> {

    public save(data: DeviceDataWrapper): Promise<void> {
        entity.device_key = StringUtil.randomString(25);
        return super.dao.save(this.class, entity);
    }

    protected get class(): new () => Device {
        return Device;
    }

    protected get dao(): DeviceDataDao {
        return DeviceDataDao.instance<DeviceDataDao>();
    }

}