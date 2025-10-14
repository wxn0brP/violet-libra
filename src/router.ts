import { marked } from "marked";
import { getMd, getMdList } from "./mgr/md.mgr";
import { Router } from "@wxn0brp/falcon-frame";
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