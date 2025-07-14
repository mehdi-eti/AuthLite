/** @format */

import { z } from "zod";

export const registerSchema = z
	.object({
		email: z.string().email("Invalid email format"),
		confirmPassword: z.string(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		firstName: z.string().min(3, "First name must be at least 3 characters").max(50, "First name cannot exceed 50 characters"),
		lastName: z.string().min(3, "Last name must be at least 3 characters").max(50, "Last name cannot exceed 50 characters"),
		phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(30, "Username cannot exceed 30 characters")
			.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	});

export const verifyEmailSchema = {
	token: z.string().optional(),
	code: z.string().max(6).min(6).optional(),
};

export const resendEmailVerificationSchema = {
	email: z.string().email("Invalid email format"),
};

export const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email format"),
});

export const loginWithEmailSchema = z.object({
	email: z.string().min(1, { message: "Please enter your email" }).email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
});

export const OTPSchema = z.object({
	code: z.string().min(1, { message: "Please enter your otp code." }),
});
