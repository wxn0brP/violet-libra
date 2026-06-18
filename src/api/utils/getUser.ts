import { db } from "#mgr/db.init";
import { AnotherCache } from "@wxn0brp/ac";
import { FFRequest } from "@wxn0brp/falcon-frame";
import { UserManager } from "@wxn0brp/gate-warden";
import { JWTPayload, jwtVerify } from "jose";

const cache = new AnotherCache<string>();
const encoded = new TextEncoder().encode(process.env.JWT_SECRET);
const gwUsers = new UserManager(db.access);

export async function getUser(req: FFRequest) {
    try {
        const token = req.query.token;
        if (!token) return {};

        if (cache.has(token))
            return { _id: cache.get(token) };

        let payload: JWTPayload;
        try {
            const res = await jwtVerify(token, encoded);
            payload = res.payload;
        } catch {
            return {};
        }

        const userId = payload.sub;
        if (!userId) return {};

        const dbToken = await db.access.token.findOne({ _id: token });
        if (!dbToken) return {};

        const user = await gwUsers.getUser(userId);
        if (!user) return {};

        cache.set(token, user._id);
        return { _id: user._id };
    } catch (error) {
        console.error("Error in getUser:", error);
        return {};
    }
}
