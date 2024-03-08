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
				signInOptions: [
					firebase.auth.EmailAuthProvider.PROVIDER_ID,
					firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					firebase.auth.FacebookAuthProvider.PROVIDER_ID,
					firebase.auth.TwitterAuthProvider.PROVIDER_ID,
					firebase.auth.GithubAuthProvider.PROVIDER_ID,
				],
				tosUrl: "/terms-of-service",
				privacyPolicyUrl: "/privacy-policy",
			};

			const ui = new firebaseui.auth.AuthUI(firebase.auth());
			ui.start("#firebaseui-auth-container", uiConfig);
		}
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
		} catch (error) {
			console.error("Error signing in:", error);
		}
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			await firebase.auth().createUserWithEmailAndPassword(email, password);
		} catch (error) {
			console.error("Error signing up:", error);
		}
	};

	const uiConfig = {
		signInFlow: "popup",
		signInSuccessUrl: "/",
		signInOptions: [
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			firebase.auth.TwitterAuthProvider.PROVIDER_ID,
			firebase.auth.GithubAuthProvider.PROVIDER_ID,
		],
		tosUrl: "/terms-of-service",
		privacyPolicyUrl: "/privacy-policy",
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
			</form>
			<div id="firebaseui-auth-container"></div>
		</div>
	);
}
