// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [email, setEmail] = useState();
	const [displayName, setDisplayName] = useState();
	const [userId, setUid] = useState();
	// Initialize in local storage if it exists, otherwise initialize as null
	const [userData, setUserData] = useState(
		JSON.parse(localStorage.getItem("userData")) || null
	);

	// Any time the userData changes, update it in local storage
	useEffect(() => {
		console.log("userData", userData);
		localStorage.setItem("userData", JSON.stringify(userData));
	}, [userData]);

	const updateUser = (data) => {
		setDisplayName(data.displayName);
		setEmail(data.email);
		setUid(data.uid);

		// Pull data from Firebase and store it in the context
		fetch(`http://localhost:3001/user/${data.uid}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((userData) => {
				setUserData(userData);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	};

	function isLoggedIn() {
		return !(
			!userId ||
			userId === "" ||
			userId === null ||
			userId === undefined
		);
	}

	function logOut() {
		firebase
			.auth()
			.signOut()
			.then(() => {
				setUserData(null);
				setEmail(null);
				setDisplayName(null);
				setUid(null);
			})
			.catch((error) => {
				console.log(error);
			});
		localStorage.removeItem("userData");
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
				logOut,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
