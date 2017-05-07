export class Entity {

    constructor() {}

    id: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;

    public get isUpdating(): boolean {
        return this.id == undefined;
    }

    public static get className(): string {
        return (this as Object).constructor.name;
    }
}