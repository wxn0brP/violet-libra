import { PermissionResolverEngine } from "@wxn0brp/vql/permissions/resolver";
import { gw } from "../perm";

export const resolver = new PermissionResolverEngine();

resolver.addResolver(
    async (_, p) => p[0] === "api-cms-admin",
    async (args) => {
        const { user, p } = args;
        if (!user || !user._id) return false;
        const hasAccess = await gw.hasAccess(user._id, "api-cms-admin", p);
        return hasAccess.granted;
    }
);