import { Search } from "@wxn0brp/vql/vql";
import { PostMeta } from "./meta";

export interface RssItem {
    title: string;
    description: string;
    content: string;
    link: string;
    pubDate: Date;
    tags: string[];
}

export interface RssOpts {
    tags?: string[];
    q?: Search<PostMeta>;
    raw?: boolean;
}
