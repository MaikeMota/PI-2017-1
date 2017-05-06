
import { GenericDao } from "./GenericDao";
import { ForbiddenException } from "../src/api/rethink/core/exception";
import { User, UserInstance } from "../src/model/interface";

export class UserDao extends GenericDao<UserInstance, User> {

    public byCredentials(username: string, password: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.getModelForEntity(User).find({
                where: {
                    username: username,
                    password: password,
                    active: true
                }
            }).then((dbUser) => {
                if (dbUser) {
                    resolve(dbUser.dataValues);
                } else {
                    throw new ForbiddenException("User not found.", -1);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
}