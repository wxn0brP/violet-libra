import { PostMeta } from "#types/meta";
import { Search } from "@wxn0brp/vql/vql";
import Fuse from "fuse.js";
import db from "./db.init";
import { getMdList } from "./md.mgr";

export interface SearchOptions {
    name?: string;
    tags?: string[];
    _id?: string;
    id?: string;
    limit?: number;
}

export type SearchResult = Pick<PostMeta, "tags" | "name" | "_id">;

function mapPost(post: PostMeta): SearchResult {
    return {
        tags: post.tags,
        name: post.name,
        _id: post._id
    };
}

export async function performSearch(searchOptions: SearchOptions): Promise<SearchResult[]> {
    if (searchOptions._id || searchOptions.id) {
        const post = await db.meta.findOne<SearchResult>("md", { _id: searchOptions._id || searchOptions.id }, { select: ["name", "tags", "_id"] });
        return post ? [post] : [];
    }

    const query: Search<PostMeta> = {};
    if (searchOptions.tags) query["$arrincall"] = { tags: searchOptions.tags };

    const posts = await getMdList(query);
    const limit = +searchOptions.limit || posts.length;
    const name = searchOptions.name?.trim();
    if (!name) return posts.slice(0, limit).map(mapPost);

    const fuse = new Fuse(posts, {
        keys: ["name", "desc"],
        includeScore: true,
        threshold: 0.4,
    });

    const search = fuse.search(name).map(result => result.item);
    return search.slice(0, limit).map(mapPost);
}
