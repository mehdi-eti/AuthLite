"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @format */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: parseInt(process.env.PORT || "3001"),
    env: process.env.NODE_ENV || "development",
    dbUri: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_EXPIRES: "15m",
    REFRESH_EXPIRES: "7d",
    GHASEDAK_SMS_KEY: process.env.GHASEDAK_SMS_KEY,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
};
exports.default = config;
