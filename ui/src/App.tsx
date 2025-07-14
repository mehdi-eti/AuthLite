/** @format */

import { Routes, Route } from "react-router-dom";

import { authRoutes } from "@/features/auth";
import { ProtectedRoute } from "./features/auth/components/protected-route";

function App() {
	return (
		<Routes>
			{authRoutes.map(({ Element, path }, i) => (
				<Route key={i} element={<Element />} path={path} />
			))}
			<Route
				path=''
				element={
					<ProtectedRoute>
						<h1>HI</h1>
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
