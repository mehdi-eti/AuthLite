/** @format */

import { useEffect, useState } from "react";

import { getMe } from "../api";
import { AuthContext } from ".";
import type { User } from "../types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getMe()
			.then((data) => setUser(data.user))
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	}, []);

	return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser }}>{children}</AuthContext.Provider>;
};
