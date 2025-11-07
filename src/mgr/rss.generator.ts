import { RssItem } from "#types/rss";

/**
 * Generates an XML RSS feed conforming to RSS 2.0 specification
 * @param items An array of items to include in the RSS feed
 * @param title The title of the RSS feed
 * @param description The description of the RSS feed
 * @param baseUrl The base URL of the application
 * @returns The formatted XML of the RSS feed as a string
 */
export function generateRssXml(items: RssItem[], title: string, description: string, baseUrl: string): string {
    const now = new Date().toUTCString();
    let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${now}</lastBuildDate>
    <language>en</language>`;

    for (const item of items) {
        rssXml += `
    <item>
        <title>${escapeXml(item.title ?? "")}</title>
        <description>${escapeXml(item.description ?? "")}</description>
        <content:encoded><![CDATA[${item.content ?? ""}]]></content:encoded>
        <link>${baseUrl}${item.link}</link>
        <guid isPermaLink="true">${baseUrl}${item.link}</guid>
        <pubDate>${item.pubDate.toUTCString()}</pubDate>
    </item>`;
    }

    rssXml += `
</channel>
</rss>`;

    return rssXml;
}

/**
 * Escapes XML special characters except within CDATA
 */
function escapeXml(str: string): string {
    return (str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
