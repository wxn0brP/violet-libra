import { convertIdToUnix } from "@wxn0brp/db";
import { getMdList, getMd } from "./md.mgr";
import { marked } from "marked";
import { PostMeta } from "#types/meta";
import { RssItem } from "#types/rss";

export async function getRssItems(): Promise<RssItem[]> {
    const postMeta = await getMdList() as PostMeta[];

    const rssItems: RssItem[] = [];

    for (const meta of postMeta) {
        const post = await getMd(meta.name);

        if (post.err || !post.content) {
            console.warn(`Skipping post ${meta.name} due to error or missing content`);
            continue;
        }

        const contentHtml = await marked(post.content);
        const pubDate = new Date(convertIdToUnix(post.meta._id));

        rssItems.push({
            title: meta.name,
            description: meta.desc || "",
            content: contentHtml,
            link: `/post/${meta.name}`,
            pubDate,
            tags: meta.tags || []
        });
    }

    rssItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    return rssItems;
}