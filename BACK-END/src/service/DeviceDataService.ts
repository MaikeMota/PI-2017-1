import { Device, DeviceInstance, DeviceData } from "../model/interface/";
import { EntityService } from "./";
import { StringUtil } from "../../../RETHINK/util";
import { DeviceDataDao } from "../../database";
import { DeviceDataWrapper } from "../model/DeviceDataWrapper";

export class DeviceDataService extends EntityService<DeviceData> {

    public save(data: DeviceDataWrapper): Promise<DeviceData> {
        let entity = data.toDeviceDataEntity();
        return this.dao.save(this.class, entity);
    }

    protected get class(): new () => DeviceData {
        return DeviceData;
    }

    protected get dao(): DeviceDataDao {
        return DeviceDataDao.instance<DeviceDataDao>();
    }

}