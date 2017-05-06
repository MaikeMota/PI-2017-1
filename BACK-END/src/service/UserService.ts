import { User, UserInstance } from "../model/interface/";
import { UserDao } from "../../database/UserDao";
import { EntityService } from "./";

export class UserService extends EntityService<User> {

    public byCredentials(username: string, password: string): Promise<User> {
        return UserDao.instance<UserDao>().byCredentials(username, password);
    }

    public static instance(): UserService {
        return super.instance<UserService>();
    }

    protected getClass(): new () => User {
        return User;
    };

}