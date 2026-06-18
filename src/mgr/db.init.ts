import { User } from "#types/account";
import { ConfigValue } from "#types/config";
import { AccessToken } from "#types/db";
import { PostMeta } from "#types/meta";
import { ValtheraCreate } from "@wxn0brp/db";
import { User as GateWardenUser, Role, RoleRule } from "@wxn0brp/gate-warden/types/system";
import fs from "fs";

if (!fs.existsSync("data"))
    fs.mkdirSync("data");

if (!fs.existsSync("data/md"))
    fs.mkdirSync("data/md");

export const db = {
    meta: ValtheraCreate<{
        md: PostMeta;
    }>("data/meta"),
    access: ValtheraCreate<{
        usr: User;
        token: AccessToken;
        users: GateWardenUser;
        roles: Role;
        [collection: `role/${string}`]: RoleRule;
    }>("data/access"),
    system: ValtheraCreate<{
        config: ConfigValue;
    }>("data/system"),
}
