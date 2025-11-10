import db from "#mgr/db.init";

const configDefaults = [
    { _: "app.name", v: "VIOLET LIBRA" },

    { _: "auth.admin.login", v: "admin" },
    { _: "auth.admin.email", v: "admin@vl.com" },
    { _: "auth.admin.pass", v: "" },

    { _: "perm.admin.id", v: "admin" },
    { _: "perm.admin.role.id", v: "admin" },
] as const;

for (const { _: k, v } of configDefaults) {
    await db.system.updateOneOrAdd("config", { k }, {}, { add_arg: { k, v }, id_gen: false });
}

export type CfgKey = typeof configDefaults[number]["_"];

export const cfg = {
    get(k: CfgKey): Promise<string> {
        return db.system.findOne<{ v: string }>("config", { k }).then(r => r?.v);
    },
    set(k: CfgKey, v: string) {
        return db.system.updateOneOrAdd("config", { k }, { v });
    },
}