import { User } from '../entities/User';

export class UserWrapper {

    constructor(naturalPerson, user) {
        if (naturalPerson) {
            this.naturalPerson.id = naturalPerson.id;
            this.naturalPerson.name = naturalPerson.name;
            this.naturalPerson.surname = naturalPerson.surname;
        }
        if (user) {
            this.id = user.id;
            this.username = user.username;
        }
    }

    // Person Data
    public naturalPerson: {
        id: string,
        name: string;
        surname: string;
    }

    // User Data
    public id: string;
    public username: string;
}