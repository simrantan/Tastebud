import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

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
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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

	firebase.auth().onAuthStateChanged(function (user) {
		let currentUid;
		// onAuthStateChanged listener triggers every time the user ID token changes.
		// This could happen when a new user signs in or signs out.
		// It could also happen when the current user ID token expires and is refreshed.
		if (user && user.uid !== currentUid) {
			// Update the UI when a new user signs in.
			// Otherwise ignore if this is a token refresh.
			// Update the current user UID.
			currentUid = user.uid;
			console.log("User is signed in: ", user.displayName, user.uid);
		} else {
			// Sign out operation. Reset the current user UID.
			currentUid = null;
			console.log("no user signed in");
		}
	});

	const handleLogin = async (e) => {
		e.preventDefault();
		console.log("Logging in with email and password");
		try {
			await firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then((userCredential) => {
					// Signed in
					const user = userCredential.user;
					console.log("User logged in:", user);
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode, errorMessage);
				});
		} catch (error) {
			console.error("Error signing in:", error);
		}
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		console.log("Signing up with email and password");
		try {
			await firebase.auth().createUserWithEmailAndPassword(email, password);
		} catch (error) {
			console.error("Error signing up:", error);
		}
	};

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

				<button type="submit" className="btn btn-primary" onClick={handleLogin}>
					Login
				</button>

				<button
					type="submit"
					className="btn btn-primary"
					onClick={handleSignup}
				>
					Sign Up
				</button>

				<button className="btn btn-primary" onClick={handleLogout}>
					Log Out
				</button>
			</form>
			<div id="firebaseui-auth-container"></div>
		</div>
	);
}
