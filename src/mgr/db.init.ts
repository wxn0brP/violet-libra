import { Valthera, ValtheraClass } from "@wxn0brp/db";
import { MemoryAction } from "@wxn0brp/db-core/db/memory";
import { MultiBackend } from "@wxn0brp/db-core/db/multiStorage";
import { createFileActions } from "@wxn0brp/db-storage-dir";
import fs from "fs";

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

if (!fs.existsSync("data/md")) {
    fs.mkdirSync("data/md");
}

export const memory = new MemoryAction();
export const file = createFileActions("data/access");

export const multi = new MultiBackend([memory, file], 1);

export const dbGw = new ValtheraClass({
    dbAction: multi
});

const db = {
    meta: new Valthera("data/meta"),
    access: dbGw,
    system: new Valthera("data/system"),
}

export default db;