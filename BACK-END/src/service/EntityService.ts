import { GenericDao } from '../../database/GenericDao';
import { Entity } from "../model/interface";

export class EntityService<T extends Entity> {

    protected static _instance: EntityService<any>;

    public static instance<T extends EntityService<any>>(): T {
        if (!this._instance) {
            this._instance = new this();
        }
        return <T>this._instance;
    }

    public save<T>(entity: T): Promise<T> {
        return GenericDao.instance().save(this.getClass(), entity);
    }

    public update<T>(entity: T): Promise<T> {
        return GenericDao.instance().update(this.getClass(), entity);
    }

    public delete<T>(entity: T): Promise<void> {
        return GenericDao.instance().delete(this.getClass(), entity);
    }

    public byId<T>(id: string): Promise<T> {
        return GenericDao.instance().byId(this.getClass(), id);
    }

    public list<T>(offset: number = 0, limit: number = 10): Promise<T[]> {
        return GenericDao.instance().list(this.getClass());
    }

    protected getClass(): new () => T {
        return undefined;
    };
}