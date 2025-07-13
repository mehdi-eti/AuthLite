/** @format */

import { Routes, Route } from "react-router-dom";

import { routes } from "@/features/auth";

function App() {
	return (
		<Routes>
			{routes.map(({ Element, path }, i) => (
				<Route key={i} element={<Element />} path={path} />
			))}
		</Routes>
	);
}

export default App;
