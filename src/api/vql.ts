import VQLProcessor, { VQLConfig } from "@wxn0brp/vql";
import db from "../mgr/db.init";
import { apiAdapter } from "./api";
import { resolver } from "./resolver";
import { gw } from "../perm";

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