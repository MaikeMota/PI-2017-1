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

    public static parse<T extends Enum>(value: string): T {
        for (let type of this.values<T>()) {
            if (type.name === value) {
                return type;
            }
        }
        return undefined;
    }

    public static fromOrdinal<T extends Enum>(index: number): T {
        let key: string = Object.keys(this)[index];
        return ObjectUtil.cast<T>(this[key]);
    }

    public static ordinal<T extends Enum>(value: string): number {
        let index: number = 0;
        for (let type of this.values<T>()) {
            if (type.name === value) {
                return index;
            }else {
                index++;
            }
        }
        return -1;
    }

}
