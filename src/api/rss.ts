import { generateRssXml } from "#mgr/rss.generator";
import { getRssItems } from "#mgr/rss.mgr";
import { RouteHandler } from "@wxn0brp/falcon-frame";

export const rssHandler: RouteHandler = async (req, res) => {
    try {
        const rssItems = await getRssItems({
            tags: req.query.tags ? req.query.tags.split(",") : undefined,
            q: req.query.q ? JSON.parse(req.query.q) : undefined,
            raw: typeof req.query.raw !== "undefined",
        });

        const protocol = req.headers["x-forwarded-proto"] ? "https" : "http";
        const host = req.headers.host || "localhost:15987";
        const baseUrl = `${protocol}://${host}`;
        const rssXml = generateRssXml(rssItems, "Violet Libra RSS Feed", "Latest posts from Violet Libra blog", baseUrl);
        res.send(rssXml);
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        res.status(500).send("Error generating RSS feed");
    }
}