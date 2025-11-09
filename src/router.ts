import { Router } from "@wxn0brp/falcon-frame";
import { marked } from "marked";
import { getMd, getMdList } from "./mgr/md.mgr";
import { rssHandler } from "#api/rss";

const router = new Router();

router.get("/", async (req, res) => {
    const listData = await getMdList();
    const list = `<ul>${listData.map(item => `<li><a href="${item.name}">${item.name}</a></li>`).join("")}</ul>`
    res.render("index", { body: `<h1>List</h1>` + list });
});

router.get("/cms", (req, res) => res.render("cms"));
router.get("/login", (req, res) => res.render("login"));

for (const path of ["rss", "rss.xml", "feed.xml", "feed", "feed.rss"])
    router.get("/" + path, rssHandler);

router.get("/:id", async (req, res, next) => {
    const md = await getMd(req.params.id);
    if (md.err) {
        next();
        return;
    }
    const content = marked(md.content);
    res.render("post", { title: md.meta.name, body: content });
});

export default router;