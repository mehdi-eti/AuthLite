/** @format */

import type { JSX } from "react";

import { Otp } from "./otp-form";
import { API_URL } from "@/config";
import { SignIn } from "./sign-in-form";
import { SignUp } from "./sign-up-form";
import { ForgotPassword } from "./forgot-password-form";

export { AuthLayout } from "./components/auth-layout";
export { PasswordInput } from "./components/password-input";
export { loginWithEmailSchema, registerSchema, resendEmailVerificationSchema, verifyEmailSchema, forgotPasswordSchema, OTPSchema } from "./schema";

export const authPaths = {
	SignIn: "/auth/sign-in",
	SignUp: "/auth/sign-up",
	ForgotPassword: "/auth/forgot-password",
	OTP: "/auth/otp",
};
export const authRoutes: { path: string; Element: JSX.ElementType }[] = [
	{ path: authPaths.SignIn, Element: SignIn },
	{ path: authPaths.SignUp, Element: SignUp },
	{ path: authPaths.ForgotPassword, Element: ForgotPassword },
	{ path: authPaths.OTP, Element: Otp },
];

export const apiRoutes = {
	register: `${API_URL}/auth/register`,
	verifyEmail: `${API_URL}/auth/verify-email`,
	resendEmailVerification: `${API_URL}/auth/resend-email-verification`,
	loginWithWmail: `${API_URL}/auth/login-with-email`,
	sessions: `${API_URL}/auth/sessions`,
	me: `${API_URL}/auth/me`,
};
