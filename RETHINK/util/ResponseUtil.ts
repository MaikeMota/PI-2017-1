import { Response } from 'express';
import {
    RTKException, ForbiddenException, BadRequestException, ServerErrorException, EntityNotFoundException,
    UnprocessableEntityException
} from '../core/exception';
import { Entity } from '../core/Entity';
import { ObjectUtil } from '../util/ObjectUtil';

export abstract class ResponseUtil {

    public static produceResponse(response: Response, error: RTKException): void {
        response.statusCode = error.statusCode;
        response.json(error);
    }

    public static getItems<T extends Entity>(jsonArray, clazz: new (...args) => T): T[] {
        let items: T[] = [];

        if (ObjectUtil.isBlank(jsonArray) || ObjectUtil.isBlank(jsonArray.items)) {
            return [];
        }

        for (let i = 0; i < jsonArray.items.length; i++) {
            let item = this.getItem(jsonArray.items[i], clazz);
            items.push(item);
        }

        return items;
    }

    public static getItem<T extends Entity>(json, clazz: new (...args) => T): T {
        let item: T = new clazz();
        item.fill(json);
        return item;
    }
}