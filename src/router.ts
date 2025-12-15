import { rssHandler } from "#api/rss";
import { rateLimit } from "#rate";
import { Router } from "@wxn0brp/falcon-frame";
import { getMd, getMdList } from "./mgr/md.mgr";
import { renderMd } from "#renderMd";

const router = new Router();
router.use(rateLimit);

router.get("/", async (req, res) => {
    const listData = await getMdList();
    const list = `<ul>${listData.map(item => `<li><a href="${item.name}">${item.name}</a></li>`).join("")}</ul>`
    res.render("index", { body: `<h1>List</h1>` + list });
});

router.get("/cms", (req, res) => res.render("cms"));
router.get("/login", (req, res) => res.render("login"));

const rssRouter = router.router("/");
rssRouter.use((req, res, next) => {
    res.setHeader("Content-Type", "application/rss+xml");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

for (const path of ["rss", "rss.xml", "feed.xml", "feed", "feed.rss"])
    rssRouter.get("/" + path, rssHandler);

router.get("/:id", async (req, res, next) => {
    const md = await getMd(req.params.id);
    if (md.err) {
        next();
        return;
    }

    const body = await renderMd(md.content);

    res.render("post", { title: md.meta.name, body });
});

export default router;