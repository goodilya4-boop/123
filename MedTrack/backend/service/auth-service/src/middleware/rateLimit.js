const buckets = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const cleanup = (now) => {
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
};

const signinRateLimit = (req, res, next) => {
    const now = Date.now();
    cleanup(now);

    const key = req.ip || req.socket.remoteAddress || "unknown";
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        bucket = {
            attempts: 0,
            resetAt: now + WINDOW_MS
        };
        buckets.set(key, bucket);
    }

    if (bucket.attempts >= MAX_ATTEMPTS) {
        const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
        res.set("Retry-After", String(retryAfter));
        return res.status(429).send({
            message: "Слишком много попыток входа. Повторите позже."
        });
    }

    bucket.attempts += 1;
    req.rateLimitKey = key;
    next();
};

const resetSigninRateLimit = (key) => {
    if (key) {
        buckets.delete(key);
    }
};

module.exports = {
    signinRateLimit,
    resetSigninRateLimit
};