import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { Calculator } from '../service/Calculator';
import { Entity, Device } from "../model/interface";
import { DeviceService, EntityService } from '../service';


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
    }

    private static create<T extends Entity>(request: Request, response: Response, next: NextFunction) {
        let requestDevice: Device = request.body;
        DeviceService.instance().save(requestDevice).then(() => {
            response.json(requestDevice);
        }).catch(next);
    }

    private static update(request: Request, response: Response, next: NextFunction) {
    }

    private static delete(request: Request, response: Response, next: NextFunction) {
    }
}