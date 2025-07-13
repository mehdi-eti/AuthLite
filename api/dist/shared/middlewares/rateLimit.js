"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// حداکثر 5 درخواست در هر 10 دقیقه برای این route
exports.resendVerificationRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 دقیقه
    max: 5,
    message: {
        status: 429,
        error: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Rate limit by IP + email to prevent spamming specific users
        return `${req.ip}-${req.body.email}`;
    },
});
