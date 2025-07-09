/** @format */
import Ghasedak from "ghasedaksms";

const ghasedak = new Ghasedak(config.GHASEDAK_SMS_KEY);

export async function sendOtpSms(mobile, inputs, templateName, clientReferenceId) {
	const otpSmsCommand = {
		sendDate: "2024-07-09T20:03:25.658Z",
		receptors: [{ mobile, clientReferenceId }],
		templateName,
		inputs,
		udh: true,
	};

	await ghasedak.sendOtpSms(otpSmsCommand);

	return { success: true };
}
