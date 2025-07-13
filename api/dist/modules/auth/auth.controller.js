"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meController = exports.logoutController = exports.deleteSession = exports.getSessions = exports.loginWithEmail = exports.resendEmailVerificationController = exports.verifyEmailController = exports.registerController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = __importDefault(require("@/config/env"));
const prisma_1 = require("@/config/prisma");
const mailer_1 = require("@/shared/utils/mailer");
const utils_1 = require("./utils");
const response_1 = require("@/shared/utils/response");
const registerController = async (req, res) => {
    const { email, password, firstName, lastName, phone, username } = req.body;
    const token = (0, utils_1.generateToken)();
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const { code, expiresAt } = (0, utils_1.generateVerificationCode)();
    const user = await prisma_1.prisma.user.create({
        data: { email, passwordHash, firstName, lastName, phone, username },
        select: { id: true, email: true, firstName: true, lastName: true, username: true, createdAt: true },
    });
    await prisma_1.prisma.verificationToken.create({
        data: { userId: user.id, code, token, type: "EMAIL_VERIFICATION", expiresAt },
    });
    await (0, mailer_1.sendVerificationEmail)(email, token, code);
    (0, response_1.apiSuccess)({ res, message: "User created successfully", statusCode: response_1.HTTP_STATUS.CREATED });
};
exports.registerController = registerController;
const verifyEmailController = async (req, res) => {
    const { token, code } = req.body;
    let record;
    if (token)
        record = await prisma_1.prisma.verificationToken.findUnique({ where: { token } });
    else if (code)
        record = await prisma_1.prisma.verificationToken.findFirst({ where: { code } });
    else {
        (0, response_1.apiError)({ res, message: "Token OR Code are required", statusCode: response_1.HTTP_STATUS.BAD_REQUEST });
        return;
    }
    if (!record || record.expiresAt < new Date()) {
        (0, response_1.apiError)({ res, message: "Invalid or expired token", statusCode: response_1.HTTP_STATUS.BAD_REQUEST });
        return;
    }
    await prisma_1.prisma.user.update({ where: { id: record?.userId }, data: { isEmailVerified: true } });
    await prisma_1.prisma.verificationToken.delete({ where: { id: record.id } });
    (0, response_1.apiSuccess)({ res, message: "Email verified. You can now log in.", statusCode: response_1.HTTP_STATUS.OK });
};
exports.verifyEmailController = verifyEmailController;
const resendEmailVerificationController = async (req, res) => {
    const { email } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || user.isEmailVerified) {
        (0, response_1.apiError)({ message: "If an account exists, a verification email has been sent.", res, statusCode: response_1.HTTP_STATUS.BAD_REQUEST });
        return;
    }
    const existingToken = await prisma_1.prisma.verificationToken.findFirst({
        where: { userId: user.id, type: "EMAIL_VERIFICATION" },
        orderBy: { createdAt: "desc" },
    });
    if (existingToken) {
        const minutesSinceLast = (Date.now() - existingToken.createdAt.getTime()) / 1000 / 60;
        if (minutesSinceLast < 3) {
            (0, response_1.apiError)({ message: "Please wait before requesting again.", res, statusCode: 429 });
            return;
        }
        await prisma_1.prisma.verificationToken.delete({ where: { token: existingToken.token } });
    }
    else {
        response_1.apiErrors.notFound(res);
        return;
    }
    const newToken = (0, utils_1.generateToken)();
    const { code, expiresAt } = (0, utils_1.generateVerificationCode)();
    await prisma_1.prisma.verificationToken.create({
        data: { userId: user.id, token: newToken, code, type: "EMAIL_VERIFICATION", expiresAt },
    });
    await (0, mailer_1.sendVerificationEmail)(email, newToken, code);
    (0, response_1.apiSuccess)({ message: "Verification email resent.", res, statusCode: response_1.HTTP_STATUS.OK });
};
exports.resendEmailVerificationController = resendEmailVerificationController;
const loginWithEmail = async (req, res) => {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
        response_1.apiErrors.notFound(res);
        return;
    }
    if (!user.isEmailVerified) {
        (0, response_1.apiError)({ message: "ابتدا ایمیل خود را تأیید کنید", res });
        return;
    }
    if (!user.isActive) {
        response_1.apiErrors.forbidden(res, "حساب شما غیرفعال شده است");
        return;
    }
    const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!isMatch) {
        (0, response_1.apiError)({ message: "ایمیل یا رمز عبور اشتباه است", res });
        return;
    }
    const accessToken = await (0, utils_1.sign)({ userId: user.id, name: `${user.firstName} ${user.lastName}`, username: user.username, email: user.email }, env_1.default.JWT_SECRET, { expiresIn: env_1.default.REFRESH_EXPIRES });
    const refreshToken = await (0, utils_1.sign)({ userId: user.id, name: `${user.firstName} ${user.lastName}`, username: user.username, email: user.email }, env_1.default.JWT_SECRET, { expiresIn: env_1.default.REFRESH_EXPIRES });
    const deviceFingerprint = crypto_1.default.randomBytes(16).toString("hex");
    await prisma_1.prisma.session.create({
        data: {
            ip: String(ip),
            userId: user.id,
            token: refreshToken,
            deviceId: deviceFingerprint,
            userAgent: userAgent.substring(0, 255),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 روز
        },
    });
    (0, response_1.apiSuccess)({ message: "ورود با موفقیت انجام شد", res })
        .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
    })
        .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.loginWithEmail = loginWithEmail;
const getSessions = async (req, res) => {
    const userId = req.user.userId;
    const sessions = await prisma_1.prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            deviceId: true,
            userAgent: true,
            ip: true,
            expiresAt: true,
            createdAt: true,
        },
    });
    (0, response_1.apiSuccess)({ res, data: sessions, message: "دریافت تمام سشن‌های فعال کاربر" });
};
exports.getSessions = getSessions;
const deleteSession = async (req, res) => {
    const userId = req.userId;
    const { sessionId } = req.params;
    const session = await prisma_1.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) {
        response_1.apiErrors.notFound(res);
        return;
    }
    await prisma_1.prisma.session.delete({ where: { id: sessionId } });
    (0, response_1.apiSuccess)({ message: "Session deleted", res });
};
exports.deleteSession = deleteSession;
// ----------------------------------------------------------------------------------------------------------
const logoutController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken)
        await prisma_1.prisma.session.deleteMany({ where: { token: refreshToken } });
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    };
    (0, response_1.apiSuccess)({ res, message: "logged out", data: {}, statusCode: response_1.HTTP_STATUS.OK })
        .clearCookie("refreshToken", cookieOptions)
        .clearCookie("accessToken", cookieOptions);
};
exports.logoutController = logoutController;
const meController = async (req, res) => {
    const user = req.user;
    if (!user)
        return response_1.apiErrors.unauthorized(res);
    (0, response_1.apiSuccess)({ message: "OK", res, data: user, statusCode: response_1.HTTP_STATUS.OK });
};
exports.meController = meController;
