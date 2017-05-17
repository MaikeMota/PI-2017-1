import { RTKObject } from './RTKObject';
import { ObjectUtil } from '../util/ObjectUtil';
import { StringUtil } from '../util/StringUtil';
import { Enum } from './Enum';
import { typed } from "./";

export class Entity extends RTKObject {

    constructor() {
        super();
    }

    id: string;
    /**
     * Returns a boolean representing if a entity is updating or not
     */
    public get isUpdating(): boolean {
        return ObjectUtil.isPresent(this.id);
    }

    /**
     * Fills this object using the given json
     * @param json The json corresponding this object
     */
    public fill(json: any): void {

        if (ObjectUtil.isBlank(json)) {
            return;
        }

        for (let propertyName in json) {
            let value: any = json[propertyName];

            if (ObjectUtil.isBlank(value) || ObjectUtil.isPresent(value.id)) {
                continue;
            }

            let type = Reflect.getMetadata("design:type", this, propertyName);

            if (ObjectUtil.isPresent(type)) {
                if (type.prototype instanceof Enum) {
                    value = type.parse(json[propertyName]);
                } else if ("Array" === type.name) {
                    let arrayType = Reflect.getMetadata("design:arrayType", this, propertyName);
                    let array = [];
                    json[propertyName].forEach((jsonData) => {
                        let arrayItem = new arrayType();
                        arrayItem.fill(jsonData);
                        array.push(arrayItem);
                    });
                    value = array;
                }
            }


            this[propertyName] = value;
        }
    }

    public json(): string {
        return super.json((key, value) => {
            if (value instanceof Entity) {
                return StringUtil.isNullEmptyOrUndefined(value.id) ? null : value.id;
            }
        });
    }
}