import { UserWrapper } from "./UserWrapper";

export class AuthenticationWrapper {
    public username: string;
    public password: string;

    public userWrapper: UserWrapper;
    public token: string;
}