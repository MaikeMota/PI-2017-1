import { RandomStringType, StringUtil } from '../util/StringUtil';
import { ObjectUtil } from "../util/ObjectUtil";

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
    public _initialize() {
        if (ObjectUtil.isBlank(this.obj_id) || StringUtil.isNullEmptyOrUndefined(this.randonString)) {
            RTKObject._obj_id++;
            this.obj_id = RTKObject._obj_id;
            this.randonString = StringUtil.randomString(16, RandomStringType.ALPHANUMERIC);
        }
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
}