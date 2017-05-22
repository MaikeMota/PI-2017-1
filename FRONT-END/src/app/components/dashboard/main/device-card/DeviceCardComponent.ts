import { Component, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { Device, DeviceData } from '../../../../model/entities';
import { EventService } from "app/services";

@Component({
    selector: 'device-card',
    templateUrl: "./DeviceCardComponent.html",
    styleUrls: ["./DeviceCardComponent.css"]
})
export class DeviceCardComponent implements OnDestroy {

    @Input() public device: Device;

    @Output() private onUpdateDevice: EventEmitter<Device> = new EventEmitter<Device>();
    @Output() private onDeleteDevice: EventEmitter<Device> = new EventEmitter<Device>();
    @Output() private onNavigateToDeviceData: EventEmitter<Device> = new EventEmitter<Device>();

    private _initialized: boolean = false;

    constructor(private eventService: EventService) {

    }

    public animateWaterLevel(targetValue: number) {
        if (targetValue > 1) {
            targetValue = 1;
        } else if (targetValue < 0) {
            targetValue = 0;
        }
        setTimeout(() => {
            jQuery(`#volumeter-${this.device.id}`).animate({
                height: `${targetValue * 100}%`
            }, 1500);
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.device.currentValue != null) {
            let device: Device = changes.device.currentValue;
            let deviceData = device.data[0];
            if (deviceData) {
                let currentLevelPercent = deviceData.water_level / device.max_water_level;
                this.animateWaterLevel(currentLevelPercent);
            }

            this.eventService.listenFor(this, `DEVICE/${this.device.id}/DATA_ARRIVED`, (deviceData: DeviceData) => {
                let targetValue: number = deviceData.water_level / this.device.max_water_level;
                this.device.data.unshift(deviceData);
                this.animateWaterLevel(targetValue);
            });
        }
    }

    ngOnDestroy(): void {
        this.eventService.stopListeningAll(this);
    }

}