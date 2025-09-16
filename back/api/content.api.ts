import { RouteHandler } from "@wxn0brp/falcon-frame";
import { addOrUpdateMd, deleteMd, getMd } from "../cms/content.cms";

export const cb_get_id: RouteHandler = async (req, res) => {
    const id = req.params.id;
    const md = await getMd(id);
    return md;
}

export const cb_update: RouteHandler = async (req, res) => {
    const { id, content, tags, desc } = req.body;

    if (!id) return { err: true, msg: "id is required" };
    if (!content) return { err: true, msg: "content is required" };

    addOrUpdateMd(id, content, tags, desc);
    return { err: false, msg: "ok" };
}

export const cb_delete: RouteHandler = async (req, res) => {
    const { id } = req.body;
    deleteMd(id);
    return { err: false, msg: "ok" };
}