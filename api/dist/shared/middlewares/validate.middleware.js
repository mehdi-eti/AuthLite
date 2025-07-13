"use strict";
/** @format */
/// <reference types="../../types/express.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validate;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const types = ["query", "params", "body"];
const emptyObjectSchema = zod_1.z.object({}).strict();
/**
 * A ZodSchema type guard.
 */
function isZodSchema(schema) {
    return !!schema && typeof schema.safeParseAsync === "function";
}
// Override express@^5 request.query getter to provide setter
const descriptor = Object.getOwnPropertyDescriptor(express_1.default.request, "query");
if (descriptor) {
    Object.defineProperty(express_1.default.request, "query", {
        get() {
            if (this._query)
                return this._query;
            return descriptor?.get?.call(this);
        },
        set(query) {
            this._query = query;
        },
        configurable: true,
        enumerable: true,
    });
}
/**
 * Enhanced validation middleware with apiResponse integration
 */
function validate(schemas) {
    const validation = {
        params: isZodSchema(schemas.params) ? schemas.params : zod_1.z.object(schemas.params ?? {}).strict(),
        query: isZodSchema(schemas.query) ? schemas.query : zod_1.z.object(schemas.query ?? {}).strict(),
        body: isZodSchema(schemas.body) ? schemas.body : zod_1.z.object(schemas.body ?? {}).strict(),
    };
    return async (req, res, next) => {
        try {
            const errors = [];
            for (const type of types) {
                const parsed = await validation[type].safeParseAsync(req[type] ?? {});
                if (parsed.success)
                    req[type] = parsed.data;
                else
                    errors.push({ type, errors: parsed.error });
            }
            if (errors.length > 0) {
                if (schemas.handler)
                    return schemas.handler(errors, req, res, next);
                const validationErrors = errors.flatMap((error) => error.errors.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                    type: error.type,
                })));
                (0, response_1.apiError)({ res, message: "Validation failed", validationErrors, errorCode: "VALIDATION_ERROR" });
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
