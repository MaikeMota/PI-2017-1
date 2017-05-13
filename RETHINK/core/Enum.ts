import { ObjectUtil } from '../util/ObjectUtil';
import { RTKObject } from './RTKObject';

const language: string = "pt-BR";

export abstract class Enum extends RTKObject {
    private _name: string;
    private enumInfo: EnumInfo;
    private static _values: Map<new(...args) => any, Enum[]> = new Map<new(...args) => any, Enum[]>();

    constructor(name: string, enumInfo: EnumInfo) {
        super();
        this._name = name;
        this.enumInfo = enumInfo;
    }

    public get name(): string {
        return this._name;
    }

    public get label(): string {
        return this.enumInfo[language];
    }

    public static values<T extends Enum>(): T[] {
        if (ObjectUtil.isBlank(this._values[this.name])) {
            this._values[this.name] = [];
            let properties: string[] = Object.keys(this);

            properties.forEach(property => {
                if (this[property] instanceof Enum) {
                    this._values[this.name].push(this[property]);
                }
            });

            this._values[this.name].sort((propertyA, propertyB) => {

                if (propertyA.label < propertyB.label) {
                    return -1;
                }
                
                if (propertyA.label > propertyB.label) {
                    return 1;
                }

                return 0;
            });
        }

        return this._values[this.name] as any;
    }

    public static parse<T extends Enum>(value: any): T {
        for (let type of this.values()) {
            if (type.name === value) {
                return type as any;
            }
        }

        return undefined;
    }

    public static fromIndex<T extends Enum>(index: number): T {
        let key: string = Object.keys(this)[index];
        return ObjectUtil.cast<T>(this[key]);
    }

    public json(): string {
        return this._name;
    }

    public deepClone(): Enum {
        return this;
    }
}

export interface EnumInfo {
    [key: string]: string;
}