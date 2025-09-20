import { GateWarden } from "@wxn0brp/gate-warden";
import { MultiBackend } from "@wxn0brp/db-core/db/multiStorage";
import { MemoryAction } from "@wxn0brp/db-core/db/memory";
import dbActionC from "@wxn0brp/db-storage-dir/action";
import vFileCpu from "@wxn0brp/db-storage-dir/file/index";
import { ValtheraClass } from "@wxn0brp/db";

export const memory = new MemoryAction();
export const file = new dbActionC("data/access", {}, vFileCpu);

memory.memory.set("roles", [
    { _id: "admin", name: "admin" },
    { _id: "user", name: "user" },
    { _id: "manager", name: "manager" }
]);

memory.memory.set("users", [
    { _id: "admin", roles: ["admin", "manager"] },
    { _id: "manager", roles: ["manager"] },
]);

export const multi = new MultiBackend([memory, file]);

export const dbGw = new ValtheraClass({
    dbAction: multi
});

export const gw = new GateWarden(dbGw);