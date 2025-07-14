"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const response_1 = require("@/shared/utils/response");
/**
 * Middleware کنترل نقش
 * @param allowedRoles لیستی از نقش‌هایی که اجازه دسترسی دارند
 */
const authorize = (allowedRoles) => async (req, res, next) => {
    const user = req.user;
    if (!user) {
        response_1.apiErrors.notFound(res, "احراز هویت نشده‌اید");
        return;
    }
    if (!allowedRoles.includes(user.role)) {
        response_1.apiErrors.forbidden(res, "دسترسی غیرمجاز");
        return;
    }
    next();
};
exports.authorize = authorize;
