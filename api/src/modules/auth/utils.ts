/** @format */

import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

type Token = {
	userId?: string | number;
	name?: string;
	username?: string;
	email?: string;
	iat?: number;
	exp?: number;
	role?: string;
};

export async function sign(payload: Token, secret: string, options: { expiresIn: string | number }): Promise<string> {
	const iat = Math.floor(Date.now() / 1000);

	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256", typ: "JWT" })
		.setIssuedAt(iat)
		.setExpirationTime(options.expiresIn)
		.sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<Token> {
	const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

	return payload;
}

export function generateVerificationCode() {
	return {
		code: crypto.randomInt(100000, 999999).toString(),
		expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
	};
}

export function generateToken() {
	return crypto.randomBytes(40).toString("hex");
}
