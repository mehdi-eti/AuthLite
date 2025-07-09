/** @format */

import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";

import config from "@/config/env";
import { prisma } from "@/config/prisma";
import type { AuthenticatedRequestType } from "./types";
import { sendVerificationEmail } from "@/shared/utils/mailer";
import { generateToken, generateVerificationCode, sign } from "./utils";
import { apiError, apiErrors, apiSuccess, HTTP_STATUS } from "@/shared/utils/response";

export const registerController = async (req: Request, res: Response) => {
	const { email, password, firstName, lastName, phone, username } = req.body;

	const token = generateToken();
	const passwordHash = await bcrypt.hash(password, 10);
	const { code, expiresAt } = generateVerificationCode();

	const user = await prisma.user.create({
		data: { email, passwordHash, firstName, lastName, phone, username },
		select: { id: true, email: true, firstName: true, lastName: true, username: true, createdAt: true },
	});

	await prisma.verificationToken.create({
		data: { userId: user.id, code, token, type: "EMAIL_VERIFICATION", expiresAt },
	});

	await sendVerificationEmail(email, token, code);

	apiSuccess({ res, message: "User created successfully", statusCode: HTTP_STATUS.CREATED });
};
export const verifyEmailController = async (req: Request, res: Response) => {
	const { token, code } = req.body;

	let record;
	if (token) record = await prisma.verificationToken.findUnique({ where: { token } });
	else if (code) record = await prisma.verificationToken.findFirst({ where: { code } });
	else {
		apiError({ res, message: "Token OR Code are required" });
		return;
	}

	if (!record || record.expiresAt < new Date()) {
		apiError({ res, message: "Invalid or expired token" });
		return;
	}

	await prisma.user.update({ where: { id: record?.userId }, data: { isEmailVerified: true } });
	await prisma.verificationToken.delete({ where: { id: record.id } });

	apiSuccess({ res, message: "Email verified. You can now log in." });
};
export const resendEmailVerificationController = async (req: Request, res: Response) => {
	const { email } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || user.isEmailVerified) {
		apiError({ message: "If an account exists, a verification email has been sent.", res });
		return;
	}

	const existingToken = await prisma.verificationToken.findFirst({
		where: { userId: user.id, type: "EMAIL_VERIFICATION" },
		orderBy: { createdAt: "desc" },
	});

	if (existingToken) {
		const minutesSinceLast = (Date.now() - existingToken.createdAt.getTime()) / 1000 / 60;
		if (minutesSinceLast < 3) {
			apiError({ message: "Please wait before requesting again.", res, statusCode: 429 });
			return;
		}

		await prisma.verificationToken.delete({ where: { token: existingToken.token } });
	} else {
		apiErrors.notFound(res);
		return;
	}

	const newToken = generateToken();
	const { code, expiresAt } = generateVerificationCode();

	await prisma.verificationToken.create({
		data: { userId: user.id, token: newToken, code, type: "EMAIL_VERIFICATION", expiresAt },
	});

	await sendVerificationEmail(email, newToken, code);

	apiSuccess({ message: "Verification email resent.", res, statusCode: HTTP_STATUS.OK });
};
export const loginWithEmail = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	// FIXME userAgent and IP dosnot show in HOPPSCOTCH check in React
	const userAgent = req.headers["user-agent"];
	const deviceId = typeof req.headers["x-device-id"] === "string" ? req.headers["x-device-id"] : crypto.randomBytes(16).toString("hex");
	const ip = Array.isArray(req.headers["x-forwarded-for"])
		? req.headers["x-forwarded-for"][0]
		: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !user.passwordHash) {
		apiErrors.notFound(res);
		return;
	}
	if (!user.isEmailVerified) {
		apiError({ message: "ابتدا ایمیل خود را تأیید کنید", res });
		return;
	}
	if (!user.isActive) {
		apiErrors.forbidden(res, "حساب شما غیرفعال شده است");
		return;
	}

	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isMatch) {
		apiError({ message: "ایمیل یا رمز عبور اشتباه است", res });
		return;
	}

	const accessToken = await sign(
		{ userId: user.id, name: `${user.firstName} ${user.lastName}`, username: user.username, email: user.email },
		config.JWT_SECRET,
		{ expiresIn: config.ACCESS_EXPIRES }
	);
	const refreshToken = await sign(
		{ userId: user.id, name: `${user.firstName} ${user.lastName}`, username: user.username, email: user.email },
		config.JWT_SECRET,
		{ expiresIn: config.REFRESH_EXPIRES }
	);
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 روز

	const existing = await prisma.session.findFirst({ where: { userId: user.id, deviceId } });

	if (existing) {
		await prisma.session.update({ where: { id: existing.id }, data: { expiresAt, token: refreshToken } });
	} else {
		await prisma.session.create({
			data: {
				ip,
				expiresAt,
				userAgent,
				userId: user.id,
				token: refreshToken,
				deviceId: Array.isArray(deviceId) ? deviceId[0] : deviceId,
			},
		});
	}

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 15 * 60 * 1000,
		secure: process.env.NODE_ENV === "production",
	}).cookie("refreshToken", refreshToken, {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
		secure: process.env.NODE_ENV === "production",
	});

	apiSuccess({ message: "ورود با موفقیت انجام شد", res, data: { accessToken, deviceId } });
};
export const getSessions = async (req: Request, res: Response) => {
	const userId = (req as AuthenticatedRequestType).user.id;

	const sessions = await prisma.session.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		select: { id: true, ip: true, deviceId: true, userAgent: true, expiresAt: true, createdAt: true },
	});

	apiSuccess({ res, data: sessions, message: "دریافت تمام سشن‌های فعال کاربر" });
};
export const deleteSession = async (req: Request, res: Response) => {
	const userId = (req as any).userId;
	const { sessionId } = req.params;

	const session = await prisma.session.findUnique({ where: { id: sessionId } });

	if (!session || session.userId !== userId) {
		apiErrors.notFound(res);
		return;
	}

	await prisma.session.delete({ where: { id: sessionId } });
	apiSuccess({ message: "Session deleted", res });
};
// ----------------------------------------------------------------------------------------------------------
export const logoutController = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	if (refreshToken) await prisma.session.deleteMany({ where: { token: refreshToken } });

	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict" as const,
		path: "/",
	};
	apiSuccess({ res, message: "logged out", data: {}, statusCode: HTTP_STATUS.OK })
		.clearCookie("refreshToken", cookieOptions)
		.clearCookie("accessToken", cookieOptions);
};
export const meController = async (req: Request, res: Response) => {
	const user = (req as any).user;
	if (!user) return apiErrors.unauthorized(res);

	apiSuccess({ message: "OK", res, data: user, statusCode: HTTP_STATUS.OK });
};
