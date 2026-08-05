import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Generous limit for normal customer actions (ordering, reviews, contact, call waiter)
export const publicActionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute per identifier
  analytics: true,
  prefix: "nyc-public",
});

// Tighter limit specifically for login attempts, to slow down brute-force guessing
export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 attempts per minute per identifier
  analytics: true,
  prefix: "nyc-login",
});

export async function getClientIp(req: Request): Promise<string> {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}