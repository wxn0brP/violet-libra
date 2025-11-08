import { marked } from "marked";
import { getMd, getMdList } from "./mgr/md.mgr";
import { Router } from "@wxn0brp/falcon-frame";
import { getRssItems } from "./mgr/rss.mgr";
import { generateRssXml } from "./mgr/rss.generator";

const router = new Router();

router.get("/", async (req, res) => {
    const listData = await getMdList();
    const list = `<ul>${listData.map(item => `<li><a href="${item.name}">${item.name}</a></li>`).join("")}</ul>`
    res.render("index", { title: " | List", body: `<h1>List</h1>` + list });
});

router.get("/cms", (req, res) => {
    res.render("cms", { title: " | Editor" });
});

router.get("/login", (req, res) => res.render("login"));

router.get("/rss.xml", async (req, res) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(",") : undefined;
        const rssItems = await getRssItems(tags);
        const protocol = req.headers["x-forwarded-proto"] ? "https" : "http";
        const host = req.headers.host || "localhost:15987";
        const baseUrl = `${protocol}://${host}`;
        const rssXml = generateRssXml(rssItems, "Violet Libra RSS Feed", "Latest posts from Violet Libra blog", baseUrl);

        res.setHeader("Content-Type", "application/rss+xml");
        res.send(rssXml);
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        res.status(500).send("Error generating RSS feed");
    }
});

router.get("/:id", async (req, res, next) => {
    const md = await getMd(req.params.id);
    if (md.err) {
        next();
        return;
    }
    const content = marked(md.content);
    res.render("index", { title: " | " + md.meta.name, body: content });
});

export default router;