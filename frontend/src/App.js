// App.js
import React from "react";
import {
	Navigate,
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import RecipeBook from "./pages/RecipeBook";
import LoginPage from "./pages/Login";
import { UserProvider, useUser } from "./contexts/UserContext";
import NavBar from "./components/NavBar";
import UserProfile from "./pages/UserProfile";

export default function App() {
	return (
		<Router>
			<div className="App">
				<UserProvider>
					<NavBar />
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<MainPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/recipe-book"
							element={
								<ProtectedRoute>
									<RecipeBook />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/user-profile"
							element={
								<ProtectedRoute>
									<UserProfile />
								</ProtectedRoute>
							}
						/>

						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</UserProvider>
			</div>
		</Router>
	);
}

// via https://blog.logrocket.com/authentication-react-router-v6/
const ProtectedRoute = ({ children }) => {
	const { isLoggedIn } = useUser();

	if (!isLoggedIn()) {
		// user is not authenticated
		return <Navigate to="/login" />;
	}
	return children;
};
