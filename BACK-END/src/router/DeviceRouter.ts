import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { Calculator } from '../service/Calculator';
import { Device } from "../model/interface";
import { DeviceService } from '../service';


export class DeviceRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "device";

    protected configureRouter(): void {
        this.router.get('/', DeviceRouter.list);
        this.router.post('/', DeviceRouter.create);
        this.router.put('/:id', DeviceRouter.update);
        this.router.delete('/:id', DeviceRouter.delete);
    }

    public get PATH(): string {
        return DeviceRouter.ROOT_PATH;
    }

    private static list(request: Request, response: Response, next: NextFunction) {
    }

    private static create(request: Request, response: Response, next: NextFunction) {
        let newDevice: Device = request.body;
        DeviceService.instance.save(newDevice).then(() => {
            response.json(newDevice);
        }).catch(next);
    }

    private static update(request: Request, response: Response, next: NextFunction) {
    }

    private static delete(request: Request, response: Response, next: NextFunction) {
    }
}