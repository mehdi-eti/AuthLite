/** @format */

export interface User {
	id: string;
	email: string;
	role: "ADMIN" | "USER" | "MODERATOR";
	username?: string;
	phone: string;
	firstName: string;
	lastName: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthContextProps {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setUser: (user: User | null) => void;
	getMe: () => Promise<ApiResponseData>;
}

type ApiResponseData = Record<string, unknown> | unknown[] | null;

export interface SuccessResponseParams<T extends ApiResponseData> {
	res: Response;
	message: string;
	data?: T;
	statusCode?: number;
	meta?: Record<string, unknown>;
}

export interface ErrorResponseParams {
	res: Response;
	message: string;
	statusCode?: number;
	errorCode?: string;
	details?: unknown;
	validationErrors?: Array<{
		field: string;
		message: string;
	}>;
}
