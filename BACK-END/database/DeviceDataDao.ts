import { GenericDao } from "./GenericDao";
import { DeviceData, DeviceDataInstance } from "../src/model/interface";

export class DeviceDataDao extends GenericDao<DeviceDataInstance, DeviceData> {

    protected get class(): new () => DeviceData {
        return DeviceData;
    };

}