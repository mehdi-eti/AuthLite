/** @format */

import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Express } from "express";

import authRoutes from "@/modules/auth/auth.routes";
import { apiSuccess, HTTP_STATUS } from "./shared/utils/response";

// Load environment variables
dotenv.config();

const app: Express = express();

// Global middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
	apiSuccess({ message: "OK", res, data: {}, statusCode: HTTP_STATUS.OK });
});
app.use("/api/auth", authRoutes);

export default app;
