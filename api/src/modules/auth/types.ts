/** @format */
import { Request } from "express";

export interface AuthenticatedRequestType extends Request {
	user: {
		id: string;
		email: string;
		role: "ADMIN" | "USER" | "MODERATOR";
		isEmailVerified: boolean;
		isActive: boolean;
		phone: string;
		username: string;
		lastName: string;
		firstName: string;
		createdAt: string;
	};
}
