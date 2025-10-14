import db from "#mgr/db.init";
import { gw } from "#perm";
import VQLProcessor, { VQLConfig } from "@wxn0brp/vql";
import { apiAdapter } from "./api";
import { resolver } from "./resolver";

const config = new VQLConfig({
    noCheckPermissions: false,
    strictACL: true,
    strictSelect: true,
    hidePath: false
});

const VQL = new VQLProcessor(
    {
        ...db,
        "api-cms-admin": apiAdapter,
    },
    config,
    resolver.createWithGw(gw)
);

export default VQL;