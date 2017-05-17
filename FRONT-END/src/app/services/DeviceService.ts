import { Injectable } from '@angular/core';
import { ObjectUtil, ResponseUtil } from "../../../../RETHINK/util";
import { RTKException } from "../../../../RETHINK/core";
import { Device } from "../model/entities";
import { UserInfoService, DeviceStorageService } from "./";
import { Http, RequestOptions, Request, Headers } from '@angular/http';
import { Definitions } from "../shared/"

@Injectable()
export class DeviceService {

    public static readonly ENDPOINT = "device";

    constructor(private http: Http, private userInfoService: UserInfoService, private deviceStorageService: DeviceStorageService) {

    }


    public delete(device: Device): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (ObjectUtil.isBlank(device)) {
                reject(new RTKException("The entity cannot be null or undefined", -1, 0));
                return;
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + this.userInfoService.token);

            let requestOptions = new RequestOptions({
                method: "delete",
                url: Definitions.SERVER_RESTRICTED_ADDRESS + "/" + DeviceService.ENDPOINT + "/" + device.id,
                headers: headers,
                body: device.json()
            });

            let httpRequest: Request = new Request(requestOptions);

            this.http.request(httpRequest).toPromise().then(response => {
                resolve(response);
                this.deviceStorageService.deleteDevice(device);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public retrieveAll() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.userInfoService.token);

        let requestOptions = new RequestOptions({
            method: "get",
            url: Definitions.SERVER_RESTRICTED_ADDRESS + "/" + DeviceService.ENDPOINT + "?limit=1000000",
            headers: headers
        });

        let httpRequest: Request = new Request(requestOptions);

        this.http.request(httpRequest).toPromise().then(response => {
            ResponseUtil.getItems(response.json(), Device).forEach((device) => {
                this.deviceStorageService.addOrUpdateDevice(device);
            })
        }).catch(error => {
            console.error(error);
        });
    }

    public create(device: Device): Promise<any> {
        return new Promise<Device>((resolve, reject) => {
            if (ObjectUtil.isBlank(device)) {
                reject(new RTKException("The entity cannot be null or undefined", -1, 0));
                return;
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + this.userInfoService.token);

            let requestOptions = new RequestOptions({
                method: "post",
                url: Definitions.SERVER_RESTRICTED_ADDRESS + "/" + DeviceService.ENDPOINT,
                headers: headers,
                body: device.json()
            });

            let httpRequest: Request = new Request(requestOptions);

            this.http.request(httpRequest).toPromise().then(response => {
                device = ResponseUtil.getItem(response.json(), Device);
                resolve(device);
                this.deviceStorageService.addOrUpdateDevice(device);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public update(device: Device): Promise<any> {
        return new Promise<Device>((resolve, reject) => {
            if (ObjectUtil.isBlank(device)) {
                reject(new RTKException("The entity cannot be null or undefined", -1, 0));
                return;
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + this.userInfoService.token);

            let requestOptions = new RequestOptions({
                method: "put",
                url: Definitions.SERVER_RESTRICTED_ADDRESS + "/" + DeviceService.ENDPOINT + "/" + device.id,
                headers: headers,
                body: device.json()
            });

            let httpRequest: Request = new Request(requestOptions);

            this.http.request(httpRequest).toPromise().then(response => {
                resolve((response as any)._body ? response.json() : null);
                let index: number = -1;
                this.deviceStorageService.addOrUpdateDevice(device);
            }).catch(error => {
                reject(error);
            });
        });
    }
}