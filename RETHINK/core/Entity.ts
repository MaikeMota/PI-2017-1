import { RTKObject } from './RTKObject';
import { ObjectUtil } from '../util/ObjectUtil';
import { StringUtil } from '../util/StringUtil';
import { Enum } from './Enum';

export class Entity extends RTKObject {

    constructor() {
        super();
    }

    id: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;

    /**
     * Returns a boolean representing if a entity is updating or not
     */
    public get isUpdating(): boolean {
        return StringUtil.isNotNullNotEmptyOrUndefined(this.id);
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

            if(ObjectUtil.isBlank(value) || ObjectUtil.isPresent(value.id)) {
                continue;
            }

            let type = (Reflect as any).getMetadata("design:type", this, propertyName);

            if(ObjectUtil.isPresent(type) && type.prototype instanceof Enum){
                value = type.parse(json[propertyName]);
            }

            this[propertyName] = value;
        }
    }
}