export class Entity {
    id: string;

    public get isUpdating(): boolean {
        return this.id == undefined;
    }

    public static get className(): string {
        return (this as Object).constructor.name;
    }
}