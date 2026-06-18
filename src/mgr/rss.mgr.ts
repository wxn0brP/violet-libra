import { renderMd } from "#renderMd";
import { PostMeta } from "#types/meta";
import type { RssItem, RssOpts } from "#types/rss";
import { convertIdToUnix } from "@wxn0brp/db";
import { Search } from "@wxn0brp/vql/vql";
import { getMd, getMdList } from "./md.mgr";

export async function getRssItems(opts: RssOpts = {}): Promise<RssItem[]> {
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
