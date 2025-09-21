import { genId, ValtheraClass } from "@wxn0brp/db";
import { MemoryAction } from "@wxn0brp/db-core/db/memory";
import { MultiBackend } from "@wxn0brp/db-core/db/multiStorage";
import dbActionC from "@wxn0brp/db-storage-dir/action";
import vFileCpu from "@wxn0brp/db-storage-dir/file/index";
import { GateWarden } from "@wxn0brp/gate-warden";
import { sha256 } from "../api/account";

export const memory = new MemoryAction();
export const file = new dbActionC("data/access", {}, vFileCpu);

const adminId = process.env.ADMIN_ID || genId();
const adminRoleId = process.env.ADMIN_ROLE_ID || genId();
const managerId = process.env.MANAGER_ID || genId();
const managerRoleId = process.env.MANAGER_ROLE_ID || genId();

memory.memory.set("roles", [
    { _id: adminRoleId, name: "admin" },
    { _id: managerRoleId, name: "manager" }
]);

memory.memory.set("users", [
    { _id: adminId, roles: [adminRoleId, managerRoleId] },
    { _id: managerId, roles: [managerRoleId] },
]);

memory.memory.set("role/" + managerRoleId, [
    { _id: "api-cms-admin", p: 0b11111111 }
]);

let adminPass = "";

if (process.env.ADMIN_PASSWORD_SHA256) {
    adminPass = process.env.ADMIN_PASSWORD_SHA256;
} else if (process.env.ADMIN_PASSWORD) {
    adminPass = sha256(process.env.ADMIN_PASSWORD);
} else {
    throw new Error("ADMIN_PASSWORD or ADMIN_PASSWORD_SHA256 not configured");
}

memory.memory.set("usr", [
    {
        _id: adminId,
        login: process.env.ADMIN_LOGIN || adminId,
        email: process.env.ADMIN_EMAIL,
        pass: adminPass,
    },
])

export const multi = new MultiBackend([memory, file], 1);

export const dbGw = new ValtheraClass({
    dbAction: multi
});

export const gw = new GateWarden(dbGw);