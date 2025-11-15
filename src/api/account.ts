import db from "#mgr/db.init";
import { genId } from "@wxn0brp/db";
import { Router } from "@wxn0brp/falcon-frame";
import { SignJWT } from "jose";
import { sha256 } from "./utils/sha";

interface User {
    _id: string;
    login: string;
    email?: string;
    pass: string;
}

const router = new Router();
const sign = new TextEncoder().encode(process.env.JWT_SECRET || genId() + genId() + genId() + genId());

router.post("/login", async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(401).json({ err: true, msg: "login or wrong password" });

    const user = await db.access.findOne<User>("usr", { $or: [{ login }, { email: login }] });
    if (!user) return res.status(401).json({ err: true, msg: "login or wrong password" });
    if (user.pass !== sha256(password)) return res.status(401).json({ err: true, msg: "login or wrong password" });

    const token = await new SignJWT({ sub: user._id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(sign);

    await db.access.updateOneOrAdd("token", { usr: user._id }, { _id: token });

    return res.json({ err: false, token, name: user.login });
});

export { router as accountRouter };
