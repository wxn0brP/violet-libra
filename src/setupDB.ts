import db from "#mgr/db.init";
import { genId } from "@wxn0brp/db";

// violet libra users
let admin = await db.access.findOne<{ _id: string }>("usr", { _r: "root" });
if (!admin) {
    admin = await db.access.add("usr", { login: genId(), pass: "", _r: "root" });
    console.log("check ./data/access/usr/1.db");
}

// GW role
let adminRole = await db.access.findOne<{ _id: string }>("roles", { name: "admin" });
if (!adminRole)
    adminRole = await db.access.add("roles", { name: "admin" });

// GW user
await db.access.updateOneOrAdd(
    "users",
    {
        _id: admin._id
    },
    {},
    {
        add_arg: {
            roles: [adminRole._id]
        }
    }
);

// GW/VQL permissions
await db.access.updateOneOrAdd(
    "role/" + adminRole._id,
    {
        _id: "api-cms-admin"
    },
    {},
    {
        add_arg: {
            p: 0b11111111
        }
    }
);