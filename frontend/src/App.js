// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RecipeBook from "./pages/RecipeBook";
import LoginPage from "./pages/Login";

function App() {
	const userId = 1;

	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/recipe-book" element={<RecipeBook />} />
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
