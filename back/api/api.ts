import { AdapterBuilder } from "@wxn0brp/vql/apiAbstract";
import { addOrUpdateMd, deleteMd, getMd } from "../cms/content.cms";

const adapter = new AdapterBuilder();

adapter.findOne("md", async (search) => {
    if (!search.id) return null;
    const md = await getMd(search._id || search.id);
    return md;
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

export const apiAdapter = adapter.getAdapter(true);