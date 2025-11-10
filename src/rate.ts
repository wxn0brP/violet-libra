import { cfg } from "#config";
import { createRateLimiterPlugin } from "@wxn0brp/falcon-frame-plugin/plugins/rateLimit";

const count = await cfg.get("rate.count");
const per = await cfg.get("rate.per");
export const rateLimit = createRateLimiterPlugin(+count, +per).process;