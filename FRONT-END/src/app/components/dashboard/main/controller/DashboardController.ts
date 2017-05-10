import { Injectable } from '@angular/core';
import { Http, RequestOptions, Request, Headers } from '@angular/http';
import { Device } from '../../../../model/entities/Device';
import { AbstractController, RTKException } from '../../../../../../../RETHINK/core';
import { ObjectUtil, ResponseUtil } from '../../../../../../../RETHINK/util';
import { Definitions } from '../../../../shared/Definitions';
import { UserInfoService } from '../../../../services';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DashboardController extends AbstractController<Device> {

    public static readonly ENDPOINT = "device";
    public devices: Device[];

    constructor(private http: Http, private userInfoService: UserInfoService) {
        super();
        this.devices = [];
    }

    public clean() {
        this.entity = new Device();
    }

    public delete(): Promise<any> {
        return null;
    }

    public retrieveAll() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.userInfoService.token);

        let requestOptions = new RequestOptions({
            method: "get",
            url: Definitions.SERVER_RESTRICTED_ADDRESS + "/" + DashboardController.ENDPOINT,
            headers: headers
        });

        let httpRequest: Request = new Request(requestOptions);

        this.http.request(httpRequest).toPromise().then(response => {
            this.devices = ResponseUtil.getItems(response.json(), Device);
        }).catch(error => {
            console.error(error);
        });
    }

    public create(): Promise<any> {
        return new Promise<Device>((resolve, reject) => {
            if (ObjectUtil.isBlank(this.entity)) {
                reject(new RTKException("The entity cannot be null or undefined", -1, 0));
                return;
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + this.userInfoService.token);

            let requestOptions = new RequestOptions({
                method: "post",
                url: Definitions.SERVER_RESTRICTED_ADDRESS + "/" + DashboardController.ENDPOINT,
                headers: headers,
                body: this.entity.json()
            });

            let httpRequest: Request = new Request(requestOptions);

            this.http.request(httpRequest).toPromise().then(response => {
                resolve(response.json());
                this.devices.push(this.entity);
                this.entity = new Device();
            }).catch(error => {
                reject(error);
            });
        });
    }
}