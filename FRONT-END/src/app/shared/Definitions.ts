export class Definitions {
    public static readonly SERVER_ADDRESS = "http://127.0.0.1:3000";
    public static readonly SERVER_PUBLIC_ADDRESS = Definitions.SERVER_ADDRESS + "/api";
    public static readonly SERVER_RESTRICTED_ADDRESS = Definitions.SERVER_PUBLIC_ADDRESS + "/restricted";

    public static readonly DEVICE_OFFLINE_TIMEOUT = 10000;

    public static readonly SOCKET_EVENTS = {
        NEW_DATA_EVENT: "NEW_DEVICE_DATA"
    }
}