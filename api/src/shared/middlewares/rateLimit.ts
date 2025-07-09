/** @format */

import rateLimit from "express-rate-limit";

// حداکثر 5 درخواست در هر 10 دقیقه برای این route
export const resendVerificationRateLimiter = rateLimit({
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
