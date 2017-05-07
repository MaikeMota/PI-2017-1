import { GenericDao } from '../../database/GenericDao';
import { Entity } from '../../../RETHINK/core';
import { PaginatedList } from "../model/";

export class EntityService<T extends Entity> {

    protected static _instance: EntityService<any>;

    protected get dao(): GenericDao<any, any> {
        return GenericDao.instance();
    }

    public static instance<T extends EntityService<any>>(): T {
        if (!this._instance) {
            this._instance = new this();
        }
        return <T>this._instance;
    }

    public save<T>(entity: T): Promise<T> {
        return this.dao.save(this.class, entity);
    }

    public update<T>(entity: T): Promise<void> {
        return this.dao.update(this.class, entity);
    }

    public delete<T>(id: string): Promise<void> {
        return this.dao.delete(this.class, id);
    }

    public byId<T>(id: string): Promise<T> {
        return this.dao.byId(this.class, id);
    }

    public list<T>(offset: number = 0, limit: number = 10): Promise<PaginatedList<any>> {
        return new Promise<PaginatedList<any>>((resolve, reject) => {
            let promises = [];

            let list: PaginatedList<any> = new PaginatedList();
            list.limit = limit;
            list.offset = offset;

            promises.push(
                this.dao.count(this.class).then((totalResults) => {
                    list.totalResults = totalResults;
                })
            );

            promises.push(
                this.dao.list(this.class).then((entities: T[]) => {
                    list.items = entities;
                })
            );

            Promise.all(promises).then(() => {
                resolve(list);
            }).catch((error) => {
                reject(error)
            });
        });
    }

    protected get class(): new () => T {
        return undefined;
    };
}