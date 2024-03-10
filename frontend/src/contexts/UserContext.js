// UserContext.js
import React, { createContext, useState, useContext } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [userData, setUserData] = useState(null);
	let currentUid = userData ? userData.uid : null;

	const updateUser = (data) => {
		setUserData(data);
		console.log("User data updated: ", data);
	};

	function isLoggedIn() {
		return !(!userData || userData === null || userData === undefined);
	}

	firebase.auth().onAuthStateChanged(function (user) {
		// onAuthStateChanged listener triggers every time the user ID token changes.
		// This could happen when a new user signs in or signs out.
		// It could also happen when the current user ID token expires and is refreshed.
		if (user && user.uid !== currentUid) {
			// Update the UI when a new user signs in.
			// Otherwise ignore if this is a token refresh.
			// Update the current user UID.
			currentUid = user.uid;
			setUserData({
				email: user.email,
				uid: user.uid,
				displayName: user.displayName,
			});
		}
	});

	return (
		<UserContext.Provider value={{ userData, updateUser, isLoggedIn }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
