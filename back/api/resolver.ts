import { PermissionResolverEngine } from "@wxn0brp/vql/permissions/resolver";
import { gw } from "../perm";

export const resolver = new PermissionResolverEngine();

resolver.addResolver(
    async (_, p) => p[0] === "api-cms-admin",
    async (args) => {
        const { user, p } = args;
        const hasAccess = await gw.hasAccess(user._id, "api-cms-admin", p);
        return hasAccess.granted;
    }
);

resolver.addResolver(
    async (_, p) => p[0] === "account",
    async (args) => {
        const { p } = args;
        // Allow public access to login and register
        if (p[1] === "login" || p[1] === "register") {
            return true;
        }
        
        // For other account operations, require authentication
        return !!args.user;
    }
);

