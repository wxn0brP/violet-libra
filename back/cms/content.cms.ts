import { unlink, writeFile, readFile } from "fs/promises";
import db from "./data.cms";

const mdPath = "data/md/";

export async function addOrUpdateMd(name: string, content: string, tags: string[], desc: string) {
    await writeFile(mdPath + name + ".md", content);
    await db.meta.updateOneOrAdd(
        "md",
        { _id: name },
        { u: Date.now(), tags, desc },
        {},
        {},
        false
    );
}

export async function deleteMd(name: string) {
    await db.meta.removeOne("md", { _id: name });
    await unlink(mdPath + name + ".md");
}

export async function getMd(name: string) {
    const meta = await db.meta.findOne("md", { _id: name });
    if (!meta) return { err: true, msg: "not found" };
    const content = await readFile(mdPath + name + ".md", "utf-8");
    return { content, meta, err: false };
}

export async function getMdList() {
    return await db.meta.find("md", {}, {}, {}, { select: ["_id"] });
}