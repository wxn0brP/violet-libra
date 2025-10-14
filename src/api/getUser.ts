import db from "#mgr/db.init";
import { AnotherCache } from "@wxn0brp/ac";
import { FFRequest } from "@wxn0brp/falcon-frame";
import { jwtVerify } from "jose";

const cache = new AnotherCache<string>();

export async function getUser(req: FFRequest) {
    try {
        const token = req.query.token;
        if (!token) return {};

        if (cache.has(token)) {
            return { _id: cache.get(token) };
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET not configured");
            return {};
        }

        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

        const userId = payload.sub;
        if (!userId) return {};

        const dbToken = await db.access.findOne("token", { _id: token });
        if (!dbToken) return {};

        const user = await db.access.findOne<{ _id: string }>("users", { _id: userId });
        if (!user) return {};

        cache.set(token, user._id);
        return { _id: user._id };
    } catch (error) {
        console.error("Error in getUser:", error);
        return {};
    }
}