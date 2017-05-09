import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { Calculator } from '../service/Calculator';
import { Device } from "../model/interface";
import { DeviceService, EntityService } from '../service';

import { StringUtil } from '../../../RETHINK/util';
import { Entity } from '../../../RETHINK/core';


export class DeviceRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "device";

    protected configureRouter(): void {
        this.router.get('/', DeviceRouter.list);
        this.router.get('/:id', DeviceRouter.byId);
        this.router.post('/', DeviceRouter.create);
        this.router.put('/:id', DeviceRouter.update);
        this.router.delete('/:id', DeviceRouter.delete);
    }

    public get PATH(): string {
        return DeviceRouter.ROOT_PATH;
    }

    private static byId(request: Request, response: Response, next: NextFunction) {
        DeviceService.instance().byId(request.param('id')).then((device) => {
            response.json(device);
        }).catch(next);
    }

    private static list(request: Request, response: Response, next: NextFunction) {
        let offset: number = StringUtil.toInt(request.query['offset']);
        let limit: number = StringUtil.toInt(request.query['limit']);

        DeviceService.instance().list(offset, limit).then((deviceList) => {
            response.json(deviceList);
        }).catch(next);
    }

    private static create<T extends Entity>(request: Request, response: Response, next: NextFunction) {
        let requestDevice: Device = request.body;
        DeviceService.instance().save(requestDevice).then(() => {
            response.json(requestDevice);
        }).catch(next);
    }

    private static update(request: Request, response: Response, next: NextFunction) {
        let requestDevice: Device = request.body;
        requestDevice.id = request.param('id');
        DeviceService.instance().update(requestDevice).then(() => {
            response.json();
        }).catch(next);
    }

    private static delete(request: Request, response: Response, next: NextFunction) {
        DeviceService.instance().delete(request.param('id')).then(() => {
            response.json();
        }).catch(next);
    }
}