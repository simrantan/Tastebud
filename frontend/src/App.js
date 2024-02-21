// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

import ChatsMain from "./components/ChatsMain";

import RecipeBook from "./pages/RecipeBook";

function App() {
	const userId = 1;

	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<ChatsMain />
					<Route path="/recipe-book" element={<RecipeBook />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
