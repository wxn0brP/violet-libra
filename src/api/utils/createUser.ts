import db from "#mgr/db.init";
import { sha256 } from "./sha";

export async function createUser(name: string, pass: string) {
    if (await db.access.findOne("usr", { login: name })) return {
        err: true,
        msg: "user already exists"
    };

    await db.access.add("usr", { login: name, pass: sha256(pass) });
    return { err: false };
}