import { User, UserInstance } from "../model/interface/";
import { UserDao } from "../../database/UserDao";
import { EntityService } from "./";

export class UserService extends EntityService<User> {

    public byCredentials(username: string, password: string): Promise<User> {
        return this.dao.byCredentials(username, password);
    }

    public static instance(): UserService {
        return super.instance<UserService>();
    }

    protected get class(): new () => User {
        return User;
    };

    protected get dao(): UserDao {
        return UserDao.instance<UserDao>();
    }

}