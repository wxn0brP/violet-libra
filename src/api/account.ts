import { db } from "#mgr/db.init";
import { Router } from "@wxn0brp/falcon-frame";
import { SignJWT } from "jose";
import { sha256 } from "./utils/sha";

const router = new Router();
const sign = new TextEncoder().encode(process.env.JWT_SECRET);

router.post("/login", async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(401).json({ err: true, msg: "login or wrong password" });

    const user = await db.access.usr.findOne({ login });

    if (!user)
        return res.status(401).json({ err: true, msg: "login or wrong password" });

    if (user.pass !== sha256(password))
        return res.status(401).json({ err: true, msg: "login or wrong password" });

    const token = await new SignJWT({ sub: user._id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(sign);

    await db.access.token.updateOneOrAdd({ usr: user._id }, { _id: token });

    return res.json({ err: false, token, name: user.login });
});

export { router as accountRouter };
