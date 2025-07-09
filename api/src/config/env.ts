/** @format */
import dotenv from "dotenv";

dotenv.config();

interface Config {
	port: number;
	env: string;
	dbUri?: string;
	JWT_SECRET: string;
	ACCESS_EXPIRES: string;
	REFRESH_EXPIRES: string;
	GHASEDAK_SMS_KEY: string;
	SMTP_USER: string;
	SMTP_PASS: string;
}

const config: Config = {
	port: parseInt(process.env.PORT || "3001"),
	env: process.env.NODE_ENV || "development",
	dbUri: process.env.DB_URI,
	JWT_SECRET: process.env.JWT_SECRET!,
	ACCESS_EXPIRES: "15m",
	REFRESH_EXPIRES: "7d",
	GHASEDAK_SMS_KEY: process.env.GHASEDAK_SMS_KEY!,
	SMTP_USER: process.env.SMTP_USER!,
	SMTP_PASS: process.env.SMTP_PASS!,
};

export default config;
