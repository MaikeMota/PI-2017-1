import { Entity } from "./interface";

export class PaginatedList<T extends Entity> {

    public items: T;
    public offset: number;
    public limit: number;
    public totalResults: number;

}