import { Device, DeviceInstance, DeviceData } from "../model/interface/";
import { EntityService } from "./";
import { StringUtil } from "../../../RETHINK/util";
import { DeviceDataDao, DeviceDao } from "../../database";
import { DeviceDataWrapper } from "../model/DeviceDataWrapper";
import { UnprocessableEntityException } from "../../../RETHINK/core/exception/index";
import { DeviceDataEvent } from "../model/interface/DeviceDataEvent";
import { GenericDao } from "../../database/GenericDao";

export class DeviceDataService extends EntityService<DeviceData> {

    public save(data: DeviceDataWrapper): Promise<DeviceData> {
        return new Promise<DeviceData>((resolve, reject) => {
            if (!data.device_key) {
                throw new UnprocessableEntityException("device_key is required!", -1);
            }
            DeviceDao.instance<DeviceDao>().byDeviceKey(data.device_key).then((device) => {
                data.device_id = device.id;
                let entity = data.toDeviceDataEntity();
                this.dao.save(this.class, entity).then((deviceData) => {
                    let promises = [];
                    if (entity.events) {
                        deviceData.events = [];
                        for (let e of entity.events) {
                            e.device_data_id = device.id
                            promises.push(GenericDao.instance().save(DeviceDataEvent, e).then(ev => {
                                deviceData.events.push(ev);
                            }));
                        }
                    }
                    Promise.all(promises).then(() => {
                        resolve(deviceData);
                    }).catch((error) => {
                        reject(error)
                    });
                });
            }).catch(error => {
                reject(error);
            })
        });
    }

    protected get class(): new () => DeviceData {
        return DeviceData;
    }

    protected get dao(): DeviceDataDao {
        return DeviceDataDao.instance<DeviceDataDao>();
    }

}