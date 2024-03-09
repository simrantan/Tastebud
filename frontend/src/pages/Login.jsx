import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useUser } from "../contexts/UserContext";

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

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");

	useEffect(() => {
		// Check if AuthUI instance already exists
		if (!firebaseui.auth.AuthUI.getInstance()) {
			const uiConfig = {
				signInFlow: "popup",
				signInSuccessUrl: "/",
				signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
			};

			const ui = new firebaseui.auth.AuthUI(firebase.auth());
			if (ui.isPendingRedirect()) {
				ui.start("#firebaseui-auth-container", uiConfig);
			}
		}
	}, []);

	const handleSignup = async (e) => {
		e.preventDefault();
		// By default, Firebase will create a new user with the email and password provided
		try {
			console.log("Signing up with email and password");
			await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then(postLogin);
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
			email: userCredential.user.email,
			uid: userCredential.user.uid,
			displayName: userCredential.user.displayName,
		};
		// Update user context
		updateUser(userData);
		// Redirect to home page after successful login
		window.location.href = "/";
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
			<form>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="displayName" className="form-label">
						Display Name
					</label>
					<input
						type="text"
						className="form-control"
						id="displayName"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
				</div>

				<button
					type="submit"
					className="btn btn-primary"
					onClick={handleSignup}
				>
					Go!
				</button>

				<button className="btn btn-primary" onClick={handleLogout}>
					Log Out
				</button>
			</form>
			<div id="firebaseui-auth-container"></div>
		</div>
	);
}
