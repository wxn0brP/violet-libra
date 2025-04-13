import { Router } from "express";
import { cb_delete, cb_get_id, cb_update } from "./api/content.api";
import ejs from "ejs";
import { marked } from "marked";
import { getMd, getMdList } from "./cms/content.cms";
const router = new Router();

const apiRouter = new Router();
apiRouter.get("/md/:id", cb_get_id);
apiRouter.post("/md", cb_update);
apiRouter.delete("/md", cb_delete);
router.use("/api", apiRouter);

router.get("/", async (req, res) => {
    const listData = await getMdList();
    const list = await ejs.renderFile("front/ejs/list.ejs", { list: listData.map(item => item._id) });
    res.render("index", { title: " | List", body: list });
});

router.get("/cms", (req, res) => {
    res.render("cms/index", { title: " | Editor" });
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