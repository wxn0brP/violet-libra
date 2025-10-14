import db from "#mgr/db.init";
import { addOrUpdateMd, deleteMd, getMd } from "#mgr/md.mgr";
import { AdapterBuilder } from "@wxn0brp/vql/helpers/apiAbstract";

const adapter = new AdapterBuilder();

adapter.findOne("md", async (search) => {
    if (!search.id) return null;
    return await getMd(search._id || search.id);
});

adapter.updateOneOrAdd("md", async (search, update) => {
    const { id } = search;
    const { content, tags, desc } = update;

    if (!id || !content) return false;

    await addOrUpdateMd(id, content, tags, desc);
    return true;
});

adapter.removeOne("md", async (search) => {
    const { id } = search;
    if (!id) return false;
    await deleteMd(id);
    return true;
});

adapter.find("md", async (search) => {
    return await db.meta.find("md");
});

export const apiAdapter = adapter.getAdapter(true);