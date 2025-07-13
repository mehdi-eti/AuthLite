/** @format */

import { SignIn } from "./sign-in-form";
import { SignUp } from "./sign-up-form";
import { Otp } from "./otp-form";
import { ForgotPassword } from "./forgot-password-form";
import type { JSX } from "react";

export { AuthLayout } from "./components/auth-layout";
export { PasswordInput } from "./components/password-input";
export { loginWithEmailSchema, registerSchema, resendEmailVerificationSchema, verifyEmailSchema, forgotPasswordSchema, OTPSchema } from "./schema";

export const paths = {
	SignIn: "/auth/sign-in",
	SignUp: "/auth/sign-up",
	ForgotPassword: "/auth/forgot-password",
	OTP: "/auth/otp",
};
export const routes: { path: string; Element: JSX.ElementType }[] = [
	{ path: paths.SignIn, Element: SignIn },
	{ path: paths.SignUp, Element: SignUp },
	{ path: paths.ForgotPassword, Element: ForgotPassword },
	{ path: paths.OTP, Element: Otp },
];
