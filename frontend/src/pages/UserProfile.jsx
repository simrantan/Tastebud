import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function UserProfile({ props }) {
	const { userData, setDisplayName, logOut } = useUser();

	const [localDisplayName, setLocalDisplayName] = useState(
		userData ? userData.displayName : ""
	);

	return (
		<div className="container">
			<h1>Your Profile</h1>

			<form style={{ width: "25%" }}>
				<div className="mb-3">
					<label htmlFor="displayName" className="form-label">
						Display Name
					</label>
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							id="displayName"
							value={localDisplayName}
							onChange={(e) => setDisplayName(e.target.value)}
						/>
						<button
							className="btn btn-primary"
							type="submit"
							onClick={(e) => {
								e.preventDefault();
								setLocalDisplayName(localDisplayName);
							}}
						>
							Save
						</button>
					</div>
				</div>
			</form>

			<button className="btn btn-secondary" onClick={logOut}>
				Log Out
			</button>
		</div>
	);
}
