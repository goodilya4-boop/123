const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and contain at least 32 characters.");
}

module.exports = {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    issuer: process.env.JWT_ISSUER || "medtrack-auth",
    audience: process.env.JWT_AUDIENCE || "medtrack"
};