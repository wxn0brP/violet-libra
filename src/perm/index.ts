import { cfg } from "#config";
import { GateWarden } from "@wxn0brp/gate-warden";
import { memory, dbGw } from "#mgr/db.init";

const adminPass = await cfg.get("auth.admin.pass");
if (!adminPass)
    throw new Error("auth.admin.pass");

const adminId = await cfg.get("perm.admin.id");
const adminRoleId = await cfg.get("perm.admin.role.id");

memory.memory.set("roles", [
    { _id: adminRoleId, name: "admin" },
]);

memory.memory.set("users", [
    { _id: adminId, roles: [adminRoleId] },
]);

memory.memory.set("role/" + adminRoleId, [
    { _id: "api-cms-admin", p: 0b11111111 }
]);

memory.memory.set("usr", [
    {
        _id: adminId,
        login: await cfg.get("auth.admin.login"),
        email: await cfg.get("auth.admin.email"),
        pass: adminPass,
    },
])

export const gw = new GateWarden(dbGw);