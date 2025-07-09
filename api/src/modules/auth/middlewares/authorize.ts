/** @format */

import { prisma } from "@/config/prisma";
import { apiErrors } from "@/shared/utils/response";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware کنترل نقش
 * @param allowedRoles لیستی از نقش‌هایی که اجازه دسترسی دارند
 */
export const authorize = (allowedRoles: ("ADMIN" | "MODERATOR" | "USER")[]) => async (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;

	if (!user) {
		apiErrors.notFound(res, "احراز هویت نشده‌اید");
		return;
	}

	if (!allowedRoles.includes(user.role as any)) {
		apiErrors.forbidden(res, "دسترسی غیرمجاز");
		return;
	}

	next();
};
