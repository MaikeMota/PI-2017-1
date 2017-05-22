import { RTKObject } from './RTKObject';

export class RTKSingleton extends RTKObject {
    private static _instance: Map<new(...args) => any, any> = new Map<new(...args) => any, any>();

    protected constructor() {
        super();
    }

    public static instance<E>(): E {
        if (!this._instance.get(this.prototype as any)) {
            this._instance.set(this.prototype as any, new this());
        }
        return <E>this._instance.get(this.prototype as any);
    }
}