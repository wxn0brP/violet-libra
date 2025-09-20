import { AdapterBuilder } from "@wxn0brp/vql/apiAbstract";
import db from "../cms/data.cms";
import crypto from "crypto";
import { jwtVerify, SignJWT } from "jose";

interface User {
    _id: string;
    name: string;
    roles: string[];
    email?: string;
    password?: string;
    createdAt?: string;
}

function sha256(data: string) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

const adapter = new AdapterBuilder();

adapter.findOne("login", async (search) => {
    const { login, password } = search;
    if (!login || !password) return null;

    const user = await db.access.findOne<User>("users", { login });
    if (!user) return null;
    if (user.password !== sha256(password)) return null;

    const token = await new SignJWT({ sub: user._id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET || ""));

    return { token, name: user.name };
});

export const accountAdapter = adapter.getAdapter(true);