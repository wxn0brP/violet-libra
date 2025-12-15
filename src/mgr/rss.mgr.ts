import { convertIdToUnix } from "@wxn0brp/db";
import { getMdList, getMd } from "./md.mgr";
import { PostMeta } from "#types/meta";
import { RssItem } from "#types/rss";
import { Search } from "@wxn0brp/vql/vql";
import { renderMd } from "#renderMd";

export interface Opts {
    tags?: string[];
    q?: Search<PostMeta>;
    raw?: boolean;
}

export async function getRssItems(opts: Opts = {}): Promise<RssItem[]> {
    const query: Search<PostMeta> = opts.q || {};

    if (opts.tags?.length) {
        query["$arrincall"] = { tags: opts.tags };
    }

    const postMeta = await getMdList(query);

    const rssItems: RssItem[] = [];

    for (const meta of postMeta) {
        const post = await getMd(meta.name);

        if (post.err || !post.content) {
            console.warn(`Skipping post ${meta.name} due to error or missing content`);
            continue;
        }

        const contentHtml = opts.raw ? post.content : await renderMd(post.content);
        const pubDate = new Date(convertIdToUnix(post.meta._id));

        rssItems.push({
            title: meta.name,
            description: meta.desc || "",
            content: contentHtml,
            link: `/${meta.name}`,
            pubDate,
            tags: meta.tags || []
        });
    }

    rssItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    return rssItems;
}