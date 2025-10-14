import { readFile, unlink, writeFile } from "fs/promises";
import db from "./db.init";

const mdPath = "data/md/";

export async function addOrUpdateMd(name: string, content: string, tags: string[], desc: string) {
    await writeFile(mdPath + name + ".md", content);
    await db.meta.updateOneOrAdd(
        "md",
        { name },
        { name, tags, desc }
    );
}

export async function deleteMd(name: string) {
    await db.meta.removeOne("md", { name });
    await unlink(mdPath + name + ".md");
}

export async function getMd(name: string) {
    const meta = await db.meta.findOne<any>("md", { name });
    if (!meta) return { err: true, msg: "not found" };
    const content = await readFile(mdPath + name + ".md", "utf-8");
    return { content, meta, err: false };
}

export async function getMdList() {
    return await db.meta.find("md", {}, {}, { select: ["name"] });
}