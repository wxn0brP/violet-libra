import fs from "fs";
import { Valthera } from "@wxn0brp/db";

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

if (!fs.existsSync("data/md")) {
    fs.mkdirSync("data/md");
}

const db = {
    meta: new Valthera("data/meta"),
    access: new Valthera("data/access"),
    system: new Valthera("data/system"),
}

export default db;