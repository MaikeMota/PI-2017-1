export abstract class StringUtil {

    public static isNullEmptyOrUndefined(value: string) {
        if (value == null || value == undefined) {
            return true;
        }
        return value.trim().length == 0;
    }

}