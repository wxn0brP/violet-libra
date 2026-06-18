import { rssHandler } from "#api/rss";
import { rateLimit } from "#rate";
import { renderMd } from "#renderMd";
import { convertIdToUnix } from "@wxn0brp/db";
import { Router } from "@wxn0brp/falcon-frame";
import { escapeHTML } from "bun";
import { getMd, getMdList } from "./mgr/md.mgr";

export const router = new Router();
router.use(rateLimit);

router.get("/", async (req, res) => {
    const listData = await getMdList();
    const posts = listData
        .sort((a, b) => convertIdToUnix(b._id) - convertIdToUnix(a._id))
        .map(item => {
            const tags = (item.tags || [])
                .map(tag => `<span class="post-tag">${escapeHTML(tag)}</span>`)
                .join("");
            const published = new Date(convertIdToUnix(item._id)).toLocaleDateString("en", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            const search = [item.name, item.desc, ...(item.tags || [])].filter(Boolean).join(" ");

            return `<article class="post-card" data-search="${escapeAttr(search)}">
                <a class="post-title" href="/${encodeURIComponent(item.name)}">${escapeHTML(item.name)}</a>
                ${item.desc ? `<p class="post-desc">${escapeHTML(item.desc)}</p>` : ""}
                <div class="post-meta">
                    <time datetime="${new Date(convertIdToUnix(item._id)).toISOString()}">${published}</time>
                    ${tags ? `<div class="post-tags">${tags}</div>` : ""}
                </div>
            </article>`;
        })
        .join("");

    res.render("index", {
        body: `<section class="post-list" id="postList">${posts || `<p class="empty-state">No posts yet.</p>`}</section>`,
    });
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

function escapeAttr(value: string) {
    return escapeHTML(value).replace(/\n/g, " ");
}
