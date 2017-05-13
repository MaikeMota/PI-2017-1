import { RandomStringType, StringUtil } from '../util/StringUtil';
import { ObjectUtil } from "../util/ObjectUtil";
import * as _ from 'lodash';

export abstract class RTKObject {
    private static _obj_id: number = 0;
    private obj_id: number;
    private randonString: string;
    private _hashcode: string;

    constructor() {
        this._initialize();
    }

    /**
     * Initializes this object with the necessary values to generate the hashcode
     */
    public _initialize(): RTKObject {
        if (ObjectUtil.isBlank(this.obj_id) || StringUtil.isNullEmptyOrUndefined(this.randonString)) {
            RTKObject._obj_id++;
            this.obj_id = RTKObject._obj_id;
            this.randonString = StringUtil.randomString(16, RandomStringType.ALPHANUMERIC);
        }
        return this;
    }

    public cast<T>(): T {
        return RTKObject.cast<T>(this);
    }

    public static cast<T>(obj: any): T {
        return obj as T;
    }

    /**
     * Returns the hashcode of this object
     */
    public get hashcode(): string {
        if (StringUtil.isNullEmptyOrUndefined(this._hashcode)) {
            this._hashcode = btoa(
                typeof this
                + this.obj_id
                + this.randonString
            );
        }

        return this._hashcode;
    }

    public deepClone<T extends RTKObject>(): T {
        return RTKObject.cast<T>(_.cloneDeepWith(this, (element) => {
            if (element != this && element instanceof RTKObject) {
                return element.deepClone();
            }
        })._initialize());
    }

    /**
     * Returns the constructor of this object
     */
    public get class(): new (...args: any[]) => RTKObject {
        return this.constructor as new (...args: any[]) => RTKObject;
    }

    /**
     * Returns the typeof this object
     */
    public get type(): string {
        return typeof this;
    }

    /**
     * Returns class name of this object
     */
    public get className(): string {
        return this.constructor.name;
    }

    /**
     * Returns the prototype of this object
     */
    public get prototype(): any {
        return Object.getPrototypeOf(this);
    }

    /**
     * check if this object is instance of given class
     */
    public instanceOf<T extends RTKObject>(clazz: new (...args) => T) {
        return this instanceof clazz;
    }

    public json(interceptor?: (key: string, value: any) => any): string {
        
        return JSON.stringify(this, (key: string, value: any) => {
            if ("" === key) {
                return value;
            }
            
            if (value === '') {
                return null;
            }

            if(ObjectUtil.isPresent(interceptor)) {
                let interceptedValue: string = interceptor(key, value);
                if(StringUtil.isNotNullNotEmptyOrUndefined(interceptedValue)) {
                    return interceptedValue;
                }
            }

            if (value instanceof RTKObject) {
                return value.json();
            }
            
            if (value instanceof Date) {
                return (<Date>value).getTime();
            }

            return value;
        });
    }
}