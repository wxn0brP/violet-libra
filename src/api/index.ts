import { accountRouter } from "#api/account";
import { performSearch } from "#mgr/search.mgr";
import { Router } from "@wxn0brp/falcon-frame";

export const api = new Router();

api.use("/account", accountRouter);
api.get("/search", async (req, res) => {
    if (req.query.tags)
        req.query.tags = req.query.tags.split(",").map(tag => tag.trim()).filter(Boolean) as any;

    try {
        const results = await performSearch(req.query);
        res.json(results);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Search failed" });
    }
});