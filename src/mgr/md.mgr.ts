import { readFile, unlink, writeFile } from "fs/promises";
import db from "./db.init";
import { PostMeta } from "#types/meta";
import { Search } from "@wxn0brp/vql/vql";

const mdPath = "data/md/";

export interface GetMdOpts {
    allowPrivate?: boolean;
    allowScheduled?: boolean;
}

export async function addOrUpdateMd(name: string, content: string, meta: PostMeta) {
    await writeFile(mdPath + name + ".md", content);
    await db.meta.updateOneOrAdd(
        "md",
        { name },
        meta
    );
}

export async function deleteMd(name: string) {
    await db.meta.removeOne("md", { name });
    await unlink(mdPath + name + ".md");
}

export async function getMd(name: string, opts: GetMdOpts = {}) {
    const meta = await db.meta.findOne<PostMeta>("md", { name });
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

    return await db.meta.find<PostMeta>("md", newQuery);
}