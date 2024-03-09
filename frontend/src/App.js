// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RecipeBook from "./pages/RecipeBook";
import LoginPage from "./pages/Login";
import { UserProvider } from "./contexts/UserContext";

function App() {
	return (
		<Router>
			<div className="App">
				<UserProvider>
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/recipe-book" element={<RecipeBook />} />
						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</UserProvider>
			</div>
		</Router>
	);
}

export default App;
