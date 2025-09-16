import { marked } from "marked";
import { getMd, getMdList } from "./cms/content.cms";
import { Router } from "@wxn0brp/falcon-frame";
const router = new Router();

router.get("/", async (req, res) => {
    const listData = await getMdList();
    const list = `<ul>${listData.map(item => `<li><a href="${item._id}">${item._id}</a></li>`).join("")}</ul>`
    res.render("front/eng/index.html", { title: " | List", body: list });
});

router.get("/cms", (req, res) => {
    res.render("front/eng/cms.html", { title: " | Editor" });
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