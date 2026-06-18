import { PostMeta } from "./meta";

export interface SearchOptions {
    name?: string;
    tags?: string[];
    _id?: string;
    id?: string;
    limit?: number;
}

export type SearchResult = Pick<PostMeta, "tags" | "name" | "_id">;
