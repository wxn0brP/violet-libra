import VQLProcessor, { VQLConfig } from "@wxn0brp/vql";
import db from "../cms/data.cms";
import { apiAdapter } from "./api";
import { resolver } from "./resolver";

const config = new VQLConfig({
    noCheckPermissions: false,
    strictACL: true,
    strictSelect: true,
    hidePath: false
});

const VQL = new VQLProcessor({
    ...db,
    api: apiAdapter
}, config, resolver.createResolverOnlyPermValidFn());

export default VQL;