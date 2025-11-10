import { createRateLimiterPlugin } from "@wxn0brp/falcon-frame-plugin/plugins/rateLimit";

export const rateLimit = createRateLimiterPlugin(30, 60_000).process;