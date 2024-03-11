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

	const [email, setLocalEmail] = useState("sopferman@stanford.edu");
	const [password, setLocalPassword] = useState("password");

	const handleSignup = async (e) => {
		e.preventDefault();
		// By default, Firebase will create a new user with the email and password provided
		try {
			console.log("Signing up with email and password");
			// Create user in Firebase
			const userCredential = await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password);

			// Create user in the database
			await fetch(`http://localhost:3001/user/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userCredential.user.uid,
					email: userCredential.user.email,
				}),
			});

			// Log the user in
			postLogin(userCredential);
		} catch (error) {
			// If the user already exists, try logging in instead
			if (error.code === "auth/email-already-in-use") {
				console.log("Logging in with email and password");
				try {
					await firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						.then(postLogin)
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

	function postLogin(userCredential) {
		console.log("User logged in:", userCredential.user);
		const userData = {
			displayName: userCredential.user.displayName,
			email: userCredential.user.email,
			uid: userCredential.user.uid,
		};
		// Update user context
		updateUser(userData);
		// Redirect to home page after successful login
		navigate("/");
	}

	const handleLogout = async (e) => {
		e.preventDefault();
		console.log("Logging out");
		try {
			await firebase.auth().signOut();
		} catch (error) {
			console.error("Error signing out:", error);
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
						onChange={(e) => setLocalPassword(e.target.value)}
					/>
				</div>

				<button
					type="submit"
					className="btn btn-primary"
					onClick={handleSignup}
				>
					Go!
				</button>

				{/* <button className="btn btn-primary" onClick={handleLogout}>
					Log Out
				</button> */}
			</form>
		</div>
	);
}
