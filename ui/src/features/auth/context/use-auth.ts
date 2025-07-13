/** @format */

import { useContext } from "react";

import { AuthContext } from ".";

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth باید داخل <AuthProvider> استفاده شود");
	return ctx;
};
