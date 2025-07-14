/** @format */

import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string, code: string) => {
	const transporter = nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: 465,
		auth: { user: "d7eb54e8853f82", pass: "cf00e5e1315d4e" },
	});
	const url = `http://localhost:5173/verify-email?token=${token}`;
	const emailHtml = await ejs.renderFile(path.join(__dirname, "../../modules/auth/templates/verification-email.ejs"), {
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
		to: email,
		html: emailHtml,
		subject: "Email Verification",
		from: '"AuthLite" <etezadi_mehdi@yahoo.com>',
	});
};
