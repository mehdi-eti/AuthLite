"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerificationEmail = async (email, token, code) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "sandbox.smtp.mailtrap.io", // برای تست، بعداً به smtp واقعی وصل می‌شه
        port: 2525,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const url = `http://localhost:5173/verify-email?token=${token}`;
    const emailHtml = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../../templates/verification-email.ejs"), {
        expirationTime: 30,
        verificationLink: url,
        websiteName: "AuthLite",
        companyName: "AuthLite",
        currentYear: new Date().getFullYear(),
        companyAddress: "123 Main St, City, Country",
        verificationCode: code,
        Unsubscribe: "localhost:3000",
        PrivacyPolicy: "localhost:3000",
    });
    await transporter.sendMail({
        from: '"AuthLite" <etezadi_mehdi@yahoo.com>',
        to: email,
        subject: "تأیید ایمیل شما",
        html: emailHtml,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
