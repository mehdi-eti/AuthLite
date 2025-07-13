/** @format */

export { AuthLayout } from "./components/auth-layout";
export { PasswordInput } from "./components/password-input";
export { SignIn } from "./sign-in-form";
export { SignUp } from "./sign-up-form";
export { Otp } from "./otp-form";
export { ForgotPassword } from "./forgot-password-form";
export { loginWithEmailSchema, registerSchema, resendEmailVerificationSchema, verifyEmailSchema, forgotPasswordSchema, OTPSchema } from "./schema";
export const paths = {
	SignIn: "/auth/sign-in",
	SignUp: "/auth/sign-up",
	ForgotPassword: "/auth/forgot-password",
	OTP: "/auth/otp",
};
