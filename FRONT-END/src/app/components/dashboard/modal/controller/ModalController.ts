import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from '../../../../model/entities/Device';
import { RegistrationController, RTKException } from '../../../../../../../RETHINK/core';
import { ObjectUtil } from '../../../../../../../RETHINK/util';
import { Definitions } from '../../../../shared/Definitions';
import { UserInfoService } from '../../../../services';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ModalController extends RegistrationController<Device> {

    public static readonly ENDPOINT = "device";

    constructor(private http: Http, private userInfoService: UserInfoService) {
        super();
    }

    public clean() {
        this.entity = new Device();
    }

    public create(): Promise<any> {
        return new Promise<Device>((resolve, reject) => {
            if (ObjectUtil.isBlank(this.entity)) {
                reject(new RTKException("The entity cannot be null or undefined", -1, 0));
                return;
            }

            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userInfoService.token
            });
            let options = new RequestOptions({ headers: headers });

            this.http.post(Definitions.SERVER_RESTRICTED_ADDRESS + "/" + ModalController.ENDPOINT, this.entity.json(), options).toPromise().then(response => {
                resolve(response.json());
            }).catch(error => {
                reject(error);
            });
        });
    }

    public update(): Promise<any> {
        return null;
    }

    public delete(): Promise<any> {
        return null;
    }
}