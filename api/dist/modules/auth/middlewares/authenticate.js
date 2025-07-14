"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const prisma_1 = require("@/config/prisma");
const response_1 = require("@/shared/utils/response");
const authenticate = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        response_1.apiErrors.unauthorized(res);
        return;
    }
    try {
        const payload = await (0, utils_1.verify)(token, process.env.JWT_SECRET);
        const session = await prisma_1.prisma.session.findFirst({ where: { userId: String(payload.userId), token } });
        if (!session || session.expiresAt < new Date()) {
            response_1.apiErrors.unauthorized(res, "Session expired or invalid");
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: String(payload.userId) },
            select: {
                id: true,
                role: true,
                email: true,
                phone: true,
                username: true,
                isActive: true,
                lastName: true,
                firstName: true,
                createdAt: true,
                isEmailVerified: true,
            },
        });
        if (!user || !user.isActive) {
            response_1.apiErrors.forbidden(res);
            return;
        }
        if (!user.isEmailVerified) {
            response_1.apiErrors.forbidden(res, "Please verify your email first");
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            (0, response_1.apiError)({
                res,
                message: "Token expired",
                statusCode: response_1.HTTP_STATUS.UNAUTHORIZED,
                errorCode: "TOKEN_EXPIRED",
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            (0, response_1.apiError)({
                res,
                message: "Invalid token",
                statusCode: response_1.HTTP_STATUS.UNAUTHORIZED,
                errorCode: "INVALID_TOKEN",
            });
            return;
        }
        (0, response_1.apiError)({
            res,
            message: "Authentication failed",
            statusCode: response_1.HTTP_STATUS.UNAUTHORIZED,
            errorCode: "AUTH_FAILED",
        });
        return;
    }
};
exports.authenticate = authenticate;
