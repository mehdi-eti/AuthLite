/** @format */
/// <reference types="../../types/express.d.ts" />

import express from "express";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { type ZodError, type ZodRawShape, type ZodSchema, type ZodTypeAny, z } from "zod";

import { apiError, HTTP_STATUS } from "../utils/response";

const types = ["query", "params", "body"] as const;
const emptyObjectSchema = z.object({}).strict();
export type EmptyValidationSchema = typeof emptyObjectSchema;

/**
 * A ZodSchema type guard.
 */
function isZodSchema(schema: unknown): schema is ZodSchema {
	return !!schema && typeof (schema as ZodSchema).safeParseAsync === "function";
}

// Override express@^5 request.query getter to provide setter
const descriptor = Object.getOwnPropertyDescriptor(express.request, "query");
if (descriptor) {
	Object.defineProperty(express.request, "query", {
		get(this: Request) {
			if (this._query) return this._query;
			return descriptor?.get?.call(this);
		},
		set(this: Request, query: unknown) {
			this._query = query;
		},
		configurable: true,
		enumerable: true,
	});
}

/**
 * Enhanced validation middleware with apiResponse integration
 */
export default function validate<
	TParams extends ValidationSchema = EmptyValidationSchema,
	TQuery extends ValidationSchema = EmptyValidationSchema,
	TBody extends ValidationSchema = EmptyValidationSchema
>(schemas: CompleteValidationSchema<TParams, TQuery, TBody>): RequestHandler<ZodOutput<TParams>, any, ZodOutput<TBody>, ZodOutput<TQuery>> {
	const validation = {
		params: isZodSchema(schemas.params) ? schemas.params : z.object(schemas.params ?? {}).strict(),
		query: isZodSchema(schemas.query) ? schemas.query : z.object(schemas.query ?? {}).strict(),
		body: isZodSchema(schemas.body) ? schemas.body : z.object(schemas.body ?? {}).strict(),
	};

	return async (req, res, next): Promise<void> => {
		try {
			const errors: ErrorListItem[] = [];

			for (const type of types) {
				const parsed = await validation[type].safeParseAsync(req[type] ?? {});

				if (parsed.success) req[type] = parsed.data;
				else errors.push({ type, errors: parsed.error });
			}

			if (errors.length > 0) {
				if (schemas.handler) return schemas.handler(errors, req, res, next);

				const validationErrors = errors.flatMap((error) =>
					error.errors.errors.map((err) => ({
						field: err.path.join("."),
						message: err.message,
						type: error.type,
					}))
				);

				apiError({ res, message: "Validation failed", validationErrors, errorCode: "VALIDATION_ERROR" });
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}

// ==================== TYPES ====================

type DataType = (typeof types)[number];

export interface ErrorListItem {
	type: DataType;
	errors: ZodError;
}

export type ErrorRequestHandler<
	P = unknown,
	ResBody = any,
	ReqBody = unknown,
	ReqQuery = unknown,
	LocalsObj extends Record<string, any> = Record<string, any>
> = (
	err: ErrorListItem[],
	req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
	res: Response<ResBody, LocalsObj>,
	next: NextFunction
) => void | Promise<void>;

export type ValidationSchema = ZodTypeAny | ZodRawShape;

export interface CompleteValidationSchema<
	TParams extends ValidationSchema = EmptyValidationSchema,
	TQuery extends ValidationSchema = EmptyValidationSchema,
	TBody extends ValidationSchema = EmptyValidationSchema
> {
	handler?: ErrorRequestHandler;
	params?: TParams;
	query?: TQuery;
	body?: TBody;
}

export type ZodOutput<T extends ValidationSchema> = T extends ZodRawShape ? z.ZodObject<T>["_output"] : T["_output"];

export type WeakRequestHandler = RequestHandler<unknown, unknown, unknown, Record<string, unknown>>;
