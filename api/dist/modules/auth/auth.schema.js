"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithEmailSchema = exports.resendEmailVerificationSchema = exports.verifyEmailSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("@/config/prisma");
exports.registerSchema = {
    body: zod_1.z
        .object({
        email: zod_1.z
            .string()
            .email("Invalid email format")
            .refine(async (email) => {
            const user = await prisma_1.prisma.user.findUnique({ where: { email } });
            return !user;
        }, { message: "Email already in use" }),
        confirmPassword: zod_1.z.string().min(4),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        firstName: zod_1.z.string().min(2, "First name must be at least 2 characters").max(50, "First name cannot exceed 50 characters"),
        lastName: zod_1.z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name cannot exceed 50 characters"),
        phone: zod_1.z
            .string()
            .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
            .refine(async (phone) => {
            const user = await prisma_1.prisma.user.findUnique({ where: { phone } });
            return !user;
        }, { message: "phone already in use" }),
        username: zod_1.z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username cannot exceed 30 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
            .refine(async (username) => {
            const user = await prisma_1.prisma.user.findUnique({ where: { username } });
            return !user;
        }, { message: "username already in use" }),
    })
        .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({ code: "custom", message: "The passwords did not match", path: ["confirmPassword"] });
        }
    }),
    params: {},
    query: {},
};
exports.verifyEmailSchema = {
    body: {
        token: zod_1.z.string().optional(),
        code: zod_1.z.string().max(6).min(6).optional(),
    },
    params: {},
    query: {},
};
exports.resendEmailVerificationSchema = {
    body: {
        email: zod_1.z.string().email("Invalid email format"),
    },
    params: {},
    query: {},
};
exports.loginWithEmailSchema = {
    body: {
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
    },
    params: {},
    query: {},
};
