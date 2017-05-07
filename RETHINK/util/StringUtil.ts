export abstract class StringUtil {

    public static isNullEmptyOrUndefined(value: string) {
        if (value == null || value == undefined) {
            return true;
        }
        return value.trim().length == 0;
    }

    public static isNotNullNotEmptyOrUndefined(value: string) {
        return !StringUtil.isNullEmptyOrUndefined(value);
    }

    public static toInt(value: string): number {
        return typeof value == 'string' ? parseInt(value.replace(/\D/, "")) : undefined;
    }

    public static randomString(length, type?: RandomStringType) {
        let str = "";
        let i = 0;
        let min = type == RandomStringType.ALPHA ? 10 : 0;
        let max = type == RandomStringType.NUMERIC ? 10 : 62;
        while (i++ < length) {
            let r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    }
}

export enum RandomStringType {
    ALPHA,
    NUMERIC,
    ALPHANUMERIC
}