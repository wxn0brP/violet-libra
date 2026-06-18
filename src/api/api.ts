import { db } from "#mgr/db.init";
import { addOrUpdateMd, deleteMd, getMd } from "#mgr/md.mgr";
import { AdapterBuilder } from "@wxn0brp/vql/helpers/apiAbstract";

const adapter = new AdapterBuilder();

adapter.findOne("md", async ({ search }) => {
    if (!search.id) return null;
    return await getMd(search._id || search.id, { allowPrivate: true, allowScheduled: true });
});

adapter.updateOneOrAdd("md", async ({ search, updater }) => {
    const { id } = search;
    const update = updater as any;
    const { content } = update;
    if (!id || !content) return { data: {}, type: "updated" };
    delete update.content;
    await addOrUpdateMd(id, content, update);
    return { data: update, type: "updated" };
});

adapter.removeOne("md", async ({ search }) => {
    const { id } = search;
    if (!id) return false;
    await deleteMd(id);
    return true;
});

adapter.find("md", async () => {
    return await db.meta.md.find();
});

adapter.find("tags", async () => {
    const allDocs = await db.meta.md.find();
    const allTags = allDocs.flatMap(doc => doc.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.map(tag => ({ name: tag }));
});

export const apiAdapter = adapter.getAdapter(true);
