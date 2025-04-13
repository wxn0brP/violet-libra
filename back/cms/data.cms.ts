import fs from "fs";
import { DataBase } from "@wxn0brp/db";

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

if (!fs.existsSync("data/md")) {
    fs.mkdirSync("data/md");
}

const db = {
    meta: new DataBase("data/meta"),
    access: new DataBase("data/access"),
    system: new DataBase("data/system"),
}

export default db;