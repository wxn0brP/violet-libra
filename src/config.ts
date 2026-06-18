import { db } from "#mgr/db.init";
import { CfgKey } from "#types/config";

const configDefaults: Array<{ _: CfgKey, v: string }> = [
    { _: "app.name", v: "VIOLET LIBRA" },

    { _: "rate.count", v: "30" },
    { _: "rate.per", v: "60000" },
] as const;

for (const { _: k, v } of configDefaults) {
    await db.system.config.updateOneOrAdd({ k }, {}, { add_arg: { k, v }, id_gen: false });
}

export const cfg = {
    get(k: CfgKey): Promise<string> {
        return db.system.config.findOne({ k }).then((r: { v: string }) => r?.v);
    },
    set(k: CfgKey, v: string) {
        return db.system.config.updateOneOrAdd({ k }, { v });
    },
}
