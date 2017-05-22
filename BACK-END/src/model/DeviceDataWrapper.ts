import { DeviceData, Device } from "./interface";
import { DeviceDataEvent } from "./interface/DeviceDataEvent";
import { DeviceDataEventEnum } from "./DeviceEventEnum";

export class DeviceDataWrapper {
    device_key: string;
    device_id: string;
    waterLevel: number;
    waterInletFlux: number;
    waterOutFlux: number;
    events: number[];

    constructor(device_key: string, obj) {
        this.device_key = device_key;
        this.waterLevel = obj['waterLevel'];
        this.waterInletFlux = obj['waterInletFlux'];
        this.waterOutFlux = obj['waterOutFlux'];
        this.events = obj['events'];
    }

    public toDeviceDataEntity(): DeviceData {
        let deviceData = new DeviceData();
        deviceData.device_id = this.device_id;
        deviceData.water_level = this.waterLevel;
        deviceData.water_inlet_flux = this.waterInletFlux;
        deviceData.water_out_flux = this.waterOutFlux;
        deviceData.events = [];
        if (this.events) {
            for (let e of this.events) {
                let event = new DeviceDataEvent();
                event.event = DeviceDataEventEnum.fromOrdinal(e).name;
                deviceData.events.push(event);
            }
        }
        return deviceData;
    }
}