import { db } from "#mgr/db.init";
import { UserManager, WardenManager } from "@wxn0brp/gate-warden";

const warden = new WardenManager(db.access);
const gwUsers = new UserManager(db.access);

// violet libra users
const admin = await db.access.usr.findOne({ _r: true });
if (!admin) {
    console.error("Root user not found");
    process.exit(1);
}

const adminRoleId = await ensureAdminRole();

if (!await gwUsers.getUser(admin._id))
    await gwUsers.createUser({ _id: admin._id });

await gwUsers.addRoleToUser(admin._id, adminRoleId);
await warden.removeRBACRule(adminRoleId, "api-cms-admin").catch(() => null);
await warden.addRBACRule(adminRoleId, "api-cms-admin", 0b11111111);

async function ensureAdminRole() {
    const existing = await warden.changeRoleNameToId("admin").catch(() => null);
    if (existing)
        return existing;

    const role = await warden.addRole({ name: "admin" });
    return role._id;
}
