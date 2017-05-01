export abstract class ObjectUtil {

    public static cast<T extends Object>(obj: Object): T {
        return <T>obj;
    }

    public static isNotEmpty(obj: Object): boolean {
        return !ObjectUtil.isEmpty(obj);
    }

    public static isEmpty(obj: Object): boolean {
        return Object.keys(obj).length == 0;
    }

    public static isBlank(obj: any): boolean {
        return obj === undefined || obj === null;
    }

    public static isPresent(obj: any): boolean {
        return obj !== undefined && obj !== null;
    }
}