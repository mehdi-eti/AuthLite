/** @format */
import { Response } from "express";

/**
 * Standard API response formats for consistent communication
 */

// ==================== TYPES ====================
type ApiResponseData = Record<string, unknown> | unknown[] | null;

interface SuccessResponseParams<T extends ApiResponseData> {
	res: Response;
	message: string;
	data?: T;
	statusCode?: number;
	meta?: Record<string, unknown>;
}

interface ErrorResponseParams {
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

// ==================== CONSTANTS ====================

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	ERROR: 500,
	CONFLICT: 409,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	ACCESSDENIED: 403,
	METHOSNOTALLOWED: 405,
} as const;

// ==================== RESPONSE UTILITIES ====================

/**
 * Standardized success response
 */
export function apiSuccess<T extends ApiResponseData>({ res, message, data, statusCode = HTTP_STATUS.OK, meta }: SuccessResponseParams<T>): Response {
	return res.status(statusCode).json({
		success: true,
		message,
		data,
		...(meta && { meta }),
	});
}
/**
 * Standardized error response
 */
export function apiError({ res, message, statusCode = HTTP_STATUS.BAD_REQUEST, errorCode, details, validationErrors }: ErrorResponseParams): Response {
	const response: Record<string, unknown> = {
		success: false,
		message,
		...(errorCode && { errorCode }),
		...(typeof details === "object" && details !== null && { details }),
		...(validationErrors && { validationErrors }),
	};

	// Include error name for development environment
	if (process.env.NODE_ENV === "development" && details instanceof Error) {
		response.errorName = details.name;
		response.stack = details.stack;
	}

	return res.status(statusCode).json(response);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Common error responses for quick access
 */
export const apiErrors = {
	notFound: (res: Response, message = "Resource not found") => apiError({ res, message, statusCode: HTTP_STATUS.NOT_FOUND }),
	unauthorized: (res: Response, message = "Unauthorized") => apiError({ res, message, statusCode: HTTP_STATUS.UNAUTHORIZED }),
	forbidden: (res: Response, message = "Forbidden") => apiError({ res, message, statusCode: HTTP_STATUS.ACCESSDENIED }),
	conflict: (res: Response, message = "Conflict") => apiError({ res, message, statusCode: HTTP_STATUS.CONFLICT }),
	serverError: (res: Response, message = "Internal server error") => apiError({ res, message, statusCode: HTTP_STATUS.ERROR }),
	validationError: (res: Response, errors: Array<{ field: string; message: string }>, message = "Validation failed") =>
		apiError({ res, message, statusCode: HTTP_STATUS.BAD_REQUEST, validationErrors: errors }),
};
