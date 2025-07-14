/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./features/auth/context";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<App />
				<Toaster />
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>
);
