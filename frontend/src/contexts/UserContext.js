// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [email, setEmail] = useState();
	const [displayName, setDisplayName] = useState();
	const [uid, setUid] = useState();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		console.log("userData", userData);
	}, [userData]);

	const updateUser = (data) => {
		// Pull data from Firebase and store it in the context
		setDisplayName(data.displayName);
		setEmail(data.email);
		setUid(data.uid);
		const backendData = fetch(`http://localhost:3001/user/${uid}`);
		console.log("backendData", backendData);
		setUserData(backendData);
	};

	function isLoggedIn() {
		return !(!uid || uid === "" || uid === null || uid === undefined);
	}

	return (
		<UserContext.Provider
			value={{
				userData,
				updateUser,
				setUid,
				setDisplayName,
				setEmail,
				isLoggedIn,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
