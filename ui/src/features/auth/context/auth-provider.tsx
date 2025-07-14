/** @format */

import { useState } from "react";

import { AuthContext } from ".";
import type { User } from "../types";
import { apiRoutes } from "..";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading] = useState(false);

	const getMe = async () => {
		const res = await fetch(apiRoutes.me, { method: "GET", credentials: "include" });
		if (!res.ok) throw new Error("Unauthorized");
		return res.json();
	};

	return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser, getMe }}>{children}</AuthContext.Provider>;
};
