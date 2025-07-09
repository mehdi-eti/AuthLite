/** @format */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { verify } from "../utils";
import { prisma } from "@/config/prisma";
import { apiError, apiErrors, HTTP_STATUS } from "@/shared/utils/response";

declare global {
	namespace Express {
		interface Request {
			user?: Record<string, any>;
		}
	}
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.accessToken;
	if (!token) {
		apiErrors.unauthorized(res);
		return;
	}

	try {
		const payload = await verify(token, process.env.JWT_SECRET!);
		const session = await prisma.session.findFirst({ where: { userId: String(payload.userId), token } });

		if (!session) {
			apiErrors.unauthorized(res, "Session expired or invalid");
			return;
		}
		const user = await prisma.user.findUnique({
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
			apiErrors.forbidden(res);
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			apiError({
				res,
				message: "Token expired",
				statusCode: HTTP_STATUS.UNAUTHORIZED,
				errorCode: "TOKEN_EXPIRED",
			});
		}

		if (error instanceof jwt.JsonWebTokenError) {
			apiError({
				res,
				message: "Invalid token",
				statusCode: HTTP_STATUS.UNAUTHORIZED,
				errorCode: "INVALID_TOKEN",
			});
		}

		apiError({
			res,
			message: "Authentication failed",
			statusCode: HTTP_STATUS.UNAUTHORIZED,
			errorCode: "AUTH_FAILED",
		});
	}
};
