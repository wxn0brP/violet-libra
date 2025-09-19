import { PermissionResolverEngine } from "@wxn0brp/vql/permissions/resolver";

export const resolver = new PermissionResolverEngine();

resolver.addResolver(
    async (_, p) => {
        return p[0] === "api";
    },
    async (args) => {
        return true;
    }
);

