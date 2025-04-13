import { addOrUpdateMd, deleteMd, getMd } from "../cms/content.cms";

export async function cb_get_id(req, res) {
    const id = req.params.id;
    const md = await getMd(id);
    res.send(md);
}

export function cb_update(req, res) {
    const { id, content, tags, desc } = req.body;

    if (!id) {
        res.send({ err: true, msg: "id is required" });
        return;
    }
    if (!content) {
        res.send({ err: true, msg: "content is required" });
        return;
    }

    addOrUpdateMd(id, content, tags, desc);
    res.send({ err: false, msg: "ok" });
}

export function cb_delete(req, res) {
    const { id } = req.body;
    deleteMd(id);
    res.send({ err: false, msg: "ok" });
}