import { FFRequest } from "@wxn0brp/falcon-frame";
import { jwtVerify } from "jose";
import db from "../cms/data.cms";

interface User {
    _id: string;
    roles: string[];
}

export async function getUser(req: FFRequest) {
    try {
        const token = req.body.token;
        if (!token) return {};

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET not configured");
            return {};
        }

        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

        const userId = payload.sub;
        if (!userId) return {};

        const user = await db.access.findOne<User>("users", { _id: userId });
        if (!user) return {};

        return {
            _id: user._id,
            roles: user.roles || []
        };
    } catch (error) {
        console.error("Error in getUser:", error);
        return {};
    }
}