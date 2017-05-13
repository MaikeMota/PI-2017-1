import { Enum } from "../../../../../RETHINK/core";

export class DeviceDataEventEnum extends Enum {

    public static readonly MIN_LEVEL_REACHED: DeviceDataEventEnum = new DeviceDataEventEnum('MIN_LEVEL_REACHED', {
        "pt-BR": "Nível Mínimo Atingido"
    });

    public static readonly MED_LEVEL_REACHED: DeviceDataEventEnum = new DeviceDataEventEnum('MED_LEVEL_REACHED', {
        "pt-BR": "Nível Médio Atingido"
    });

    public static readonly MAX_LEVEL_REACHED: DeviceDataEventEnum = new DeviceDataEventEnum('MAX_LEVEL_REACHED', {
        "pt-BR": "Nível Máximo Atingido"
    });
    
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

    public static readonly WATER_INLET_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_INLET_TRIGGERED', {
        "pt-BR": "Entrada de Água Acionada"
    });

    public static readonly WATER_OUT_FLUX_TRIGGERED: DeviceDataEventEnum = new DeviceDataEventEnum('WATER_OUT_FLUX_TRIGGERED', {
        "pt-BR": "Saída de Água Acionada"
    });
}