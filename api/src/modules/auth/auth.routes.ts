/** @format */

import express from "express";

import { authenticate } from "./middlewares/authenticate";
import validate from "@/shared/middlewares/validate.middleware";
import { resendVerificationRateLimiter } from "@/shared/middlewares/rateLimit";
import { registerSchema, verifyEmailSchema, resendEmailVerificationSchema, loginWithEmailSchema } from "./auth.schema";
import {
	registerController,
	verifyEmailController,
	resendEmailVerificationController,
	getSessions,
	deleteSession,
	loginWithEmail,
	refreshAccessToken,
	meController,
} from "./auth.controller";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmailController);
router.post("/resend-email-verification", resendVerificationRateLimiter, validate(resendEmailVerificationSchema), resendEmailVerificationController);
router.post("/login-with-email", validate(loginWithEmailSchema), loginWithEmail);
router.get("/sessions", authenticate, getSessions);
router.delete("/sessions/:sessionId", authenticate, deleteSession);
router.get("/me", authenticate, meController);

export default router;
