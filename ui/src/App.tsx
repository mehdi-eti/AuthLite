/** @format */

import { Routes, Route } from "react-router-dom";

import { ForgotPassword, Otp, paths, SignIn, SignUp } from "@/features/auth";

function App() {
	return (
		<Routes>
			<Route path={paths.SignIn} element={<SignIn />} />
			<Route path={paths.SignUp} element={<SignUp />} />
			<Route path={paths.ForgotPassword} element={<ForgotPassword />} />
			<Route path={paths.OTP} element={<Otp />} />
		</Routes>
	);
}

export default App;
