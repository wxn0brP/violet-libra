import { readFile, unlink, writeFile } from "fs/promises";
import { db } from "./db.init";
import { PostMeta } from "#types/meta";
import { GetMdOpts } from "#types/md";
import { Search } from "@wxn0brp/vql/vql";

const mdPath = "data/md/";

export async function addOrUpdateMd(name: string, content: string, meta: PostMeta) {
    await writeFile(mdPath + name + ".md", content);
    await db.meta.md.updateOneOrAdd(
        { name },
        meta
    );
}

export async function deleteMd(name: string) {
    await db.meta.md.removeOne({ name });
    await unlink(mdPath + name + ".md");
}

export async function getMd(name: string, opts: GetMdOpts = {}) {
    const meta = await db.meta.md.findOne({ name });
    if (!meta) return { err: true, msg: "not found" };

    if (meta.private && !opts.allowPrivate) return { err: true, msg: "private" };
    if (Date.now() < meta.scheduled && !opts.allowScheduled) return { err: true, msg: "unpublished" };

    const content = await readFile(mdPath + name + ".md", "utf-8");
    return { content, meta, err: false };
}

export async function getMdList(query: Search = {}, opts: GetMdOpts = {}) {
    const newQuery: Search = {
        $and: []
    };

    if (!opts.allowPrivate) {
        newQuery["$and"].push({
            $or: [
                { $exists: { private: false } },
                { private: false }
            ]
        });
    }

    if (!opts.allowScheduled) {
        newQuery["$and"].push({
            $or: [
                { $exists: { scheduled: false } },
                { $lte: { scheduled: Date.now() } }
            ]
        });
    }
    if (query && typeof query === "object" && Object.keys(query).length) newQuery["$and"].push(query);

    return await db.meta.md.find(newQuery);
}
