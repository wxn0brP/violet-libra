import { db } from "#mgr/db.init";
import { sha256 } from "./sha";

export async function createUser(name: string, pass: string) {
    if (await db.access.usr.findOne({ login: name })) return {
        err: true,
        msg: "user already exists"
    };

    await db.access.usr.add({ login: name, pass: sha256(pass) });
    return { err: false };
}
