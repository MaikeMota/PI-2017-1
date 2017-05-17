import { Injectable } from '@angular/core';
import { Device } from '../../../../model/entities/Device';
import { AbstractController } from '../../../../../../../RETHINK/core';
import { DeviceService } from '../../../../services';

@Injectable()
export class DashboardController extends AbstractController<Device> {


    constructor(private deviceService: DeviceService) {
        super();
    }

    public clean() {
        this.entity = new Device();
    }

    public delete(): Promise<any> {
        return this.deviceService.delete(this.entity).then(() => {
            this.entity = new Device();
        });
    }

    public create(): Promise<any> {
        return this.deviceService.create(this.entity);
    }

    public update(): Promise<any> {
        return this.deviceService.update(this.entity).then((device) => {
            this.entity.fill(device);
        })
    }
}