/** @format */

import { z } from "zod";
import { prisma } from "@/config/prisma";

export const registerSchema = {
	body: z
		.object({
			email: z
				.string()
				.email("Invalid email format")
				.refine(
					async (email) => {
						const user = await prisma.user.findUnique({ where: { email } });
						return !user;
					},
					{ message: "Email already in use" }
				),
			confirmPassword: z.string().min(4),
			password: z
				.string()
				.min(8, "Password must be at least 8 characters")
				.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
				.regex(/[a-z]/, "Password must contain at least one lowercase letter")
				.regex(/[0-9]/, "Password must contain at least one number"),
			firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name cannot exceed 50 characters"),
			lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name cannot exceed 50 characters"),
			phone: z
				.string()
				.regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
				.refine(
					async (phone) => {
						const user = await prisma.user.findUnique({ where: { phone } });
						return !user;
					},
					{ message: "phone already in use" }
				),
			username: z
				.string()
				.min(3, "Username must be at least 3 characters")
				.max(30, "Username cannot exceed 30 characters")
				.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
				.refine(
					async (username) => {
						const user = await prisma.user.findUnique({ where: { username } });
						return !user;
					},
					{ message: "username already in use" }
				),
		})
		.superRefine(({ confirmPassword, password }, ctx) => {
			if (confirmPassword !== password) {
				ctx.addIssue({ code: "custom", message: "The passwords did not match", path: ["confirmPassword"] });
			}
		}),
	params: {},
	query: {},
};
export const verifyEmailSchema = {
	body: {
		token: z.string().optional(),
		code: z.string().max(6).min(6).optional(),
	},
	params: {},
	query: {},
};
export const resendEmailVerificationSchema = {
	body: {
		email: z.string().email("Invalid email format"),
	},
	params: {},
	query: {},
};
export const loginWithEmailSchema = {
	body: {
		email: z.string().email("Invalid email format"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
	},
	params: {},
	query: {},
};
