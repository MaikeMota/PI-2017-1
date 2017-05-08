import { ObjectUtil } from '../util';

export abstract class Enum {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }

    public static values<T extends Enum>(): T[] {
        return [];
    }

    public static parse<T extends Enum>(name: string): T {
        return this[name];
    }

    public static fromIndex<T extends Enum>(index: number): T {
        let key: string = Object.keys(this)[index];
        return ObjectUtil.cast<T>(this[key]);
    }
}
