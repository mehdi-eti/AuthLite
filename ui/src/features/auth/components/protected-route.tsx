/** @format */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { authPaths } from "..";
import { useAuth } from "../hooks";
import LoadingScreen from "@/components/loading-screen";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return <LoadingScreen />;

	if (!isAuthenticated) return <Navigate to={authPaths.SignIn} replace state={{ from: location }} />;

	return <>{children}</>;
};
