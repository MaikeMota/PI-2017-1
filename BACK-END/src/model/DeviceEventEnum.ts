
import { Enum } from "../../../RETHINK/core";

export class DeviceDataEventEnum extends Enum {
    public static readonly WATER_INLET_FLUX_STARTED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_FLUX_STARTED', {
        "pt-BR": "Início de fluxo na Entrada de Água"
    });
    public static readonly WATER_INLET_FLUX_STOPED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_FLUX_STOPED', {
        "pt-BR": "Fim de fluxo na Entrada de Água"
    });
    public static readonly WATER_OUT_FLUX_STARTED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_STARTED', {
        "pt-BR": "Início de fluxo na Saída de Água"
    });
    public static readonly WATER_OUT_FLUX_STOPED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_STOPED', {
        "pt-BR": "Fim de fluxo na Saída de Água"
    });
    public static readonly WATER_INLET_OPEN_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_OPEN_TRIGGERED', {
        "pt-BR": "Gatilho de abertura de Água disparado"
    });
    public static readonly WATER_INLET_CLOSE_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_CLOSE_TRIGGERED', {
        "pt-BR": "Gatilho de fechamento de Água disparado"
    });

    public static values(): DeviceDataEventEnum[] {
        return [
            DeviceDataEventEnum.WATER_INLET_FLUX_STARTED,
            DeviceDataEventEnum.WATER_INLET_FLUX_STOPED,
            DeviceDataEventEnum.WATER_OUT_FLUX_STARTED,
            DeviceDataEventEnum.WATER_OUT_FLUX_STOPED,
            DeviceDataEventEnum.WATER_INLET_OPEN_TRIGGERED,
            DeviceDataEventEnum.WATER_INLET_CLOSE_TRIGGERED
        ];
    }

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name;
        });
    }
}