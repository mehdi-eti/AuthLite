/** @format */

import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error("Error:", err.stack);

	if (err.name === "ValidationError") {
		return res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}

	res.status(500).json({
		status: "error",
		message: "Internal server error",
	});
};
