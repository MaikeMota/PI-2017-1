import { Enum } from "../../../../../RETHINK/core";

export class DeviceDataEventEnum extends Enum {

    public static readonly WATER_INLET_FLUX_STARTED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_FLUX_STARTED', {
        "pt-BR": "Fluxo de Entrada de Água Iniciado"
    });

    public static readonly WATER_INLET_FLUX_STOPED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_FLUX_STOPED', {
        "pt-BR": "Fluxo de Entrada de Água Parado"
    });

    public static readonly WATER_OUT_FLUX_STARTED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_STARTED', {
        "pt-BR": "Fluxo de Saída de Água Iniciado"
    });

    public static readonly WATER_OUT_FLUX_STOPED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_STOPED', {
        "pt-BR": "Fluxo de Saída de Água Parado"
    });

    public static readonly WATER_INLET_OPEN_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_OPEN_TRIGGERED', {
        "pt-BR": "Gatilho de abertura de Água disparado"
    });

    public static readonly WATER_INLET_CLOSE_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_CLOSE_TRIGGERED', {
        "pt-BR": "Gatilho de fechamento de Água disparado"
    });
}