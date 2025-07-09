/** @format */

import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string, code: string) => {
	const transporter = nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io", // برای تست، بعداً به smtp واقعی وصل می‌شه
		port: 2525,
		auth: {
			user: process.env.SMTP_USER!,
			pass: process.env.SMTP_PASS!,
		},
	});
	const url = `http://localhost:5173/verify-email?token=${token}`;
	const emailHtml = await ejs.renderFile(path.join(__dirname, "../../templates/verification-email.ejs"), {
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
