"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiErrors = exports.HTTP_STATUS = void 0;
exports.apiSuccess = apiSuccess;
exports.apiError = apiError;
// ==================== CONSTANTS ====================
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ERROR: 500,
    CONFLICT: 409,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    ACCESSDENIED: 403,
    METHOSNOTALLOWED: 405,
};
// ==================== RESPONSE UTILITIES ====================
/**
 * Standardized success response
 */
function apiSuccess({ res, message, data, statusCode = exports.HTTP_STATUS.OK, meta }) {
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
function apiError({ res, message, statusCode = exports.HTTP_STATUS.BAD_REQUEST, errorCode, details, validationErrors }) {
    const response = {
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
exports.apiErrors = {
    notFound: (res, message = "Resource not found") => apiError({ res, message, statusCode: exports.HTTP_STATUS.NOT_FOUND }),
    unauthorized: (res, message = "Unauthorized") => apiError({ res, message, statusCode: exports.HTTP_STATUS.UNAUTHORIZED }),
    forbidden: (res, message = "Forbidden") => apiError({ res, message, statusCode: exports.HTTP_STATUS.ACCESSDENIED }),
    conflict: (res, message = "Conflict") => apiError({ res, message, statusCode: exports.HTTP_STATUS.CONFLICT }),
    serverError: (res, message = "Internal server error") => apiError({ res, message, statusCode: exports.HTTP_STATUS.ERROR }),
    validationError: (res, errors, message = "Validation failed") => apiError({ res, message, statusCode: exports.HTTP_STATUS.BAD_REQUEST, validationErrors: errors }),
};
