import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractController } from '../../../../../../RETHINK/core';
import { UserInfoService } from '../../../services/UserInfoService';
import { SocketService, DeviceStorageService } from "../../../services";

@Injectable()
export class HomeController extends AbstractController<any> {

    constructor(private socketService: SocketService, private deviceStorageService: DeviceStorageService, private userInfoService: UserInfoService, private router: Router) {
        super();
        this.socketService.startListening();
    }

    clean() {

    }

    public logout() {
        this.userInfoService.token = undefined;
        this.socketService.stopListening();
        this.deviceStorageService.clear();
        this.router.navigate(["login"]);
    }
}