import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
	// Your Firebase config here
	apiKey: "AIzaSyAhAZONLZ75fA2aXOG5Qx50bhgoaA6UyUo", //TODO: make this secret
	authDomain: "tastebud-68924.firebaseapp.com",
	projectId: "tastebud-68924",
	storageBucket: "tastebud-68924.appspot.com",
	messagingSenderId: "708594287238",
	appId: "1:708594287238:web:d37ffdf34ebe8dc9fb4707",
	measurementId: "G-8WWTR34KTE",
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app(); // if already initialized, use that one
}

export default function LoginPage({ props }) {
	const { updateUser } = useUser();
	let navigate = useNavigate();

	const [email, setLocalEmail] = useState("");
	const [password, setLocalPassword] = useState("");
	const [error, setError] = useState(""); // State to hold error message

	const handleSignup = async (e) => {
		e.preventDefault();

		// Check if password meets minimum length requirement
		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}
		// By default, Firebase will create a new user with the email and password provided
		try {
			console.log("Signing up with email and password");
			// Create user in Firebase
			await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((userCredential) => {
					// Create user in the database
					fetch(`http://localhost:3001/user/`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							userId: userCredential.user.uid,
							email: userCredential.user.email,
						}),
					});

					const userData = {
						displayName: userCredential.user.displayName,
						email: userCredential.user.email,
						uid: userCredential.user.uid,
					};

					// Update user context
					updateUser(userData).then(() => {
						// Redirect after successful login
						navigate("/newConversation");
					});
				})
				.then((userCredential) => {
					// Log the user in
					// postLogin(userCredential);
				});
		} catch (error) {
			// If the user already exists, try logging in instead
			if (error.code === "auth/email-already-in-use") {
				console.log("Logging in with email and password");
				try {
					await firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						.then((userCredential) => {
							const userData = {
								displayName: userCredential.user.displayName,
								email: userCredential.user.email,
								uid: userCredential.user.uid,
							};
							console.log("logged in!");
							// Update user context
							updateUser(userData).then(() => {
								// Redirect to  after successful login
								navigate("/newConversation");
							});
						})
						.catch((error) => {
							const errorCode = error.code;
							const errorMessage = error.message;
							console.log(errorCode, errorMessage);
						});
				} catch (error) {
					console.error("Error signing in:", error);
				}
			} else {
				// Handle other errors
				console.error("Error signing up:", error.message);
			}
		}
	};

	return (
		<div className="container">
			<h1>Login / Create Account</h1>
			<form style={{ width: "50%" }}>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						value={email}
						onChange={(e) => setLocalEmail(e.target.value)}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="password"
						value={password}
						onChange={(e) => {
							setLocalPassword(e.target.value);
							setError(""); // Clear error message when password changes
						}}
					/>
					{error && <div className="text-danger">{error}</div>}{" "}
					{/* Render error message */}
				</div>

				<button
					type="submit"
					className="btn btn-primary"
					onClick={handleSignup}
				>
					Go!
				</button>
			</form>
		</div>
	);
}
