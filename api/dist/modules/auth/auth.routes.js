"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("./middlewares/authenticate");
const validate_middleware_1 = __importDefault(require("@/shared/middlewares/validate.middleware"));
const rateLimit_1 = require("@/shared/middlewares/rateLimit");
const auth_schema_1 = require("./auth.schema");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post("/register", (0, validate_middleware_1.default)(auth_schema_1.registerSchema), auth_controller_1.registerController);
router.post("/verify-email", (0, validate_middleware_1.default)(auth_schema_1.verifyEmailSchema), auth_controller_1.verifyEmailController);
router.post("/resend-email-verification", rateLimit_1.resendVerificationRateLimiter, (0, validate_middleware_1.default)(auth_schema_1.resendEmailVerificationSchema), auth_controller_1.resendEmailVerificationController);
router.get("/login-with-email", (0, validate_middleware_1.default)(auth_schema_1.loginWithEmailSchema), auth_controller_1.loginWithEmail);
router.get("/sessions", authenticate_1.authenticate, auth_controller_1.getSessions);
router.delete("/sessions/:sessionId", authenticate_1.authenticate, auth_controller_1.deleteSession);
exports.default = router;
