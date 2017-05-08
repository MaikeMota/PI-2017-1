import { DeviceData } from "./interface";

export class DeviceDataWrapper {
    waterLevel: number
    waterInletFlux: number
    waterOutFlux: number
    events: number[];

    public toDeviceDataEntity(): DeviceData {
        let deviceData = new DeviceData();

        return deviceData;
    }
}