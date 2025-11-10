import { cfg } from "#config";
import { createRateLimiterPlugin } from "@wxn0brp/falcon-frame-plugin/plugins/rateLimit";

const count = await cfg.get("rate.count");
const per = await cfg.get("rate.per");
export const rateLimit = createRateLimiterPlugin({
    maxRequests: Number(count),
    windowMs: Number(per),
    onLimitReached(req, res, ctx) {
        res.status(429).json({
            err: true,
            msg: "Too many requests. Please try again later.",
            c: 429,
            after: ctx.retryAfter
        });
    },
}).process;