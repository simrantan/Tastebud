// MainPage.jsx
import React from "react";
import PreferenceCard from "../components/PreferenceCard.jsx";
import { useUser } from "../contexts/UserContext";

export default function MainPage() {
	const { userData } = useUser();

	if (!userData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container">
			<h2>Welcome, {userData.displayName || "Chef"}!</h2>

			<PreferenceCard />
		</div>
	);
}
