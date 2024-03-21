import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function UserProfile({ props }) {
	const { userData, logOut } = useUser();

	const [localDisplayName, setLocalDisplayName] = useState(
		userData ? userData.displayName : ""
	);

	return (
		<div className="container">
			<h1>Your Profile</h1>

			<button className="btn btn-secondary" onClick={logOut}>
				Log Out
			</button>
		</div>
	);
}
