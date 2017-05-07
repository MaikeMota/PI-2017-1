import { Enum } from "../../../RETHINK/core";

export class DeviceDataEventEnum extends Enum {

    constructor(name: string) {
        super(name);
    }

    public static readonly MIN_LEVEL_REACHED: DeviceDataEventEnum = new DeviceDataEventEnum('MIN_LEVEL_REACHED');
    public static readonly MED_LEVEL_REACHED: DeviceDataEventEnum = new DeviceDataEventEnum('MED_LEVEL_REACHED');
    public static readonly MAX_LEVEL_REACHED: DeviceDataEventEnum = new DeviceDataEventEnum('MAX_LEVEL_REACHED');
    public static readonly WATER_INLET_FLUX_STARTED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_FLUX_STARTED');
    public static readonly WATER_INLET_FLUX_STOPED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_FLUX_STOPED');
    public static readonly WATER_OUT_FLUX_STARTED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_STARTED');
    public static readonly WATER_OUT_FLUX_STOPED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_STOPED');
    public static readonly WATER_INLET_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_TRIGGERED');
    public static readonly WATER_OUT_FLUX_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_TRIGGERED');

    public static value(): DeviceDataEventEnum[] {
        return [
            DeviceDataEventEnum.MIN_LEVEL_REACHED,
            DeviceDataEventEnum.MED_LEVEL_REACHED,
            DeviceDataEventEnum.MAX_LEVEL_REACHED,
            DeviceDataEventEnum.WATER_INLET_FLUX_STARTED,
            DeviceDataEventEnum.WATER_INLET_FLUX_STOPED,
            DeviceDataEventEnum.WATER_OUT_FLUX_STARTED,
            DeviceDataEventEnum.WATER_OUT_FLUX_STOPED,
            DeviceDataEventEnum.WATER_INLET_TRIGGERED,
            DeviceDataEventEnum.WATER_OUT_FLUX_TRIGGERED
        ];
    }
}