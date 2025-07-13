/** @format */

import { API_URL } from "@/config";

export const getMe = async () => {
	const res = await fetch(`${API_URL}/auth/me`, { method: "GET", credentials: "include" });

	if (!res.ok) throw new Error("Unauthorized");
	return res.json();
};
