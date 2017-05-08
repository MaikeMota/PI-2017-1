import { DeviceData, Device } from "./interface";
import { DeviceDataEvent } from "./interface/DeviceDataEvent";
import { DeviceDataEventEnum } from "./DeviceEventEnum";

export class DeviceDataWrapper {
    device_key: string;
    device: Device
    waterLevel: number
    waterInletFlux: number
    waterOutFlux: number
    events: number[];

    public toDeviceDataEntity(): DeviceData {
        let deviceData = new DeviceData();
        deviceData.device = this.device
        deviceData.water_level = this.waterLevel;
        deviceData.water_inlet_flux = this.waterInletFlux;
        deviceData.water_out_flux = this.waterOutFlux;

        deviceData.events = [];
        for (let e of this.events) {
            let event = new DeviceDataEvent();
            event.deviceData = deviceData;
            event.event = DeviceDataEventEnum.fromIndex(e);
            deviceData.events.push(event);
        }
        return deviceData;
    }
}