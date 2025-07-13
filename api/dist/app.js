"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("@/modules/auth/auth.routes"));
const response_1 = require("./shared/utils/response");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Global middleware
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api/health", (req, res) => {
    (0, response_1.apiSuccess)({ message: "OK", res, data: {}, statusCode: response_1.HTTP_STATUS.OK });
});
app.use("/api/auth", auth_routes_1.default);
exports.default = app;
