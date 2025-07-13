"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
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
exports.errorHandler = errorHandler;
