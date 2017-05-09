import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device } from '../../../../model/entities/Device';
import { AbstractController, RTKException } from '../../../../../../../RETHINK/core';
import { ObjectUtil } from '../../../../../../../RETHINK/util';
import { Definitions } from '../../../../shared/Definitions';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DashboardController extends AbstractController<Device> {

    public static readonly ENDPOINT = "device";

    constructor(private http: Http) {
        super();
    }

    public clean() {
        this.entity = new Device();
    }

    public delete(): Promise<any> {
        return null;
    }
}