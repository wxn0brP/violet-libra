import { dbGw } from "#perm";
import { Valthera } from "@wxn0brp/db";
import fs from "fs";

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

if (!fs.existsSync("data/md")) {
    fs.mkdirSync("data/md");
}

const db = {
    meta: new Valthera("data/meta"),
    access: dbGw,
    system: new Valthera("data/system"),
}

export default db;