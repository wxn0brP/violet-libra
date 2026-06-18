import { db } from "#mgr/db.init";
import { getMdList } from "#mgr/md.mgr";
import { sha256 } from "#api/utils/sha";
import type { User } from "#types/account";
import type { CfgKey } from "#types/config";
import { genId } from "@wxn0brp/db";
import { UserManager, WardenManager } from "@wxn0brp/gate-warden";
import { parseArgs } from "node:util";

const warden = new WardenManager(db.access);
const gwUsers = new UserManager(db.access);

const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
        admin: { type: "boolean" },
        help: { type: "boolean", short: "h" },
    },
});

const [command, ...args] = positionals;

if (values.help || !command) {
    help();
    process.exit(0);
}

try {
    if (command === "setup") {
        const [login, password] = args;
        await import("#config");
        const user = await setup(login, password);
        console.log(`Ready. Root user: ${user.login} (${user._id})`);
        if (!password)
            console.log("Password was not changed. Pass one as: ./admin.sh setup admin secret");
    } else if (command === "status") {
        await import("#config");
        await status();
    } else if (command === "config") {
        await import("#config");
        await config(args);
    } else if (command === "user") {
        await user(args, values.admin);
    } else {
        fail(`Unknown command: ${command}`);
    }
} catch (error) {
    fail(error instanceof Error ? error.message : String(error));
}

function help() {
    console.log([
        "Usage:",
        "  ./admin.sh setup [login] [password]",
        "  ./admin.sh status",
        "  ./admin.sh config",
        "  ./admin.sh config <key>",
        "  ./admin.sh config <key> <value>",
        "  ./admin.sh user",
        "  ./admin.sh user add <login> <password> [--admin]",
        "  ./admin.sh user password <login> <password>",
        "  ./admin.sh user admin <login>",
    ].join("\n"));
}

function fail(message: string): never {
    console.error(message);
    process.exit(1);
}

async function setup(login?: string, password?: string) {
    const root = await ensureRootUser(login, password);
    await grantAdmin(root._id);
    return root;
}

async function status() {
    const [configRows, posts, users, adminRole] = await Promise.all([
        db.system.config.find(),
        getMdList({}, { allowPrivate: true, allowScheduled: true }),
        db.access.usr.find(),
        getAdminRoleId().catch(() => null),
    ]);

    console.log("Violet Libra status");
    console.log(`Config: ${configRows.length}`);
    console.log(`Posts: ${posts.length}`);
    console.log(`Users: ${users.length}`);
    console.log(`Admin role: ${adminRole ? "ok" : "missing"}`);
}

async function config(args: string[]) {
    const [key, value] = args as [CfgKey | undefined, string | undefined];

    if (!key) {
        const rows = await db.system.config.find();
        for (const row of rows)
            console.log(`${row.k}=${row.v}`);
        return;
    }

    if (!value) {
        const row = await db.system.config.findOne({ k: key });
        console.log(row?.v ?? "");
        return;
    }

    await db.system.config.remove({ k: key });
    await db.system.config.add({ _id: key, k: key, v: value }, false);
    console.log(`Set ${key}=${value}`);
}

async function user(args: string[], adminFlag?: boolean) {
    const [action, login, password] = args;

    if (!action) {
        const users = await db.access.usr.find();
        console.log("ID\t\tLogin\t\tRole");
        for (const item of users)
            console.log(`${item._id}\t${item.login}\t\t${item._r ? "admin" : "editor"}`);
        return;
    }

    if (action === "add") {
        if (!login || !password)
            fail("Usage: ./admin.sh user add <login> <password> [--admin]");

        const existing = await findUser(login);
        if (existing)
            fail(`User already exists: ${login}`);

        const created = await db.access.usr.add({
            login,
            pass: sha256(password),
        });

        if (adminFlag)
            await grantAdmin(created._id);

        console.log(`Created user ${created.login} (${created._id})`);
        return;
    }

    if (action === "password") {
        if (!login || !password)
            fail("Usage: ./admin.sh user password <login> <password>");

        const found = await findUser(login);
        if (!found)
            fail(`User not found: ${login}`);

        await db.access.usr.updateOne({ _id: found._id }, { pass: sha256(password) });
        console.log(`Updated password for ${found.login}`);
        return;
    }

    if (action === "admin") {
        if (!login)
            fail("Usage: ./admin.sh user admin <login>");

        const found = await findUser(login);
        if (!found)
            fail(`User not found: ${login}`);

        await grantAdmin(found._id);
        console.log(`Granted admin to ${found.login}`);
        return;
    }

    fail(`Unknown user action: ${action}`);
}

async function ensureRootUser(login: string, password: string) {
    let root = await db.access.usr.findOne({ _r: true });

    if (!root) {
        return await db.access.usr.add({
            login: login || genId(),
            pass: password ? sha256(password) : "",
            _r: "root",
        });
    }

    const update: Partial<User> = {};
    if (login)
        update.login = login;
    if (password)
        update.pass = sha256(password);

    if (Object.keys(update).length)
        root = await db.access.usr.updateOne({ _id: root._id }, update);

    return root;
}

async function findUser(login: string) {
    return await db.access.usr.findOne({ login });
}

async function grantAdmin(userId: string) {
    const roleId = await ensureAdminRole();
    const gwUser = await gwUsers.getUser(userId);

    if (!gwUser)
        await gwUsers.createUser({ _id: userId });

    await gwUsers.addRoleToUser(userId, roleId);
    await ensureAdminRule(roleId);
}

async function ensureAdminRole() {
    const existing = await getAdminRoleId().catch(() => null);
    if (existing)
        return existing;

    const role = await warden.addRole({ name: "admin" });
    return role._id;
}

async function getAdminRoleId() {
    return await warden.changeRoleNameToId("admin");
}

async function ensureAdminRule(roleId: string) {
    await warden.removeRBACRule(roleId, "api-cms-admin").catch(() => null);
    await warden.addRBACRule(roleId, "api-cms-admin", 0b11111111);
}
