"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.verify = verify;
exports.generateVerificationCode = generateVerificationCode;
exports.generateToken = generateToken;
const crypto_1 = __importDefault(require("crypto"));
const jose_1 = require("jose");
async function sign(payload, secret, options) {
    const iat = Math.floor(Date.now() / 1000);
    return new jose_1.SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt(iat)
        .setExpirationTime(options.expiresIn)
        .sign(new TextEncoder().encode(secret));
}
async function verify(token, secret) {
    const { payload } = await (0, jose_1.jwtVerify)(token, new TextEncoder().encode(secret));
    return payload;
}
function generateVerificationCode() {
    return {
        code: crypto_1.default.randomInt(100000, 999999).toString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    };
}
function generateToken() {
    return crypto_1.default.randomBytes(40).toString("hex");
}
