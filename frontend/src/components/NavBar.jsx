import React from "react";
import { Link } from "react-router-dom";
import recipeBook from "../assets/recipe-book.png";

export default function NavBar({ props }) {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-end mb-3">
			<NavButton label="Chat" path="/" icon={recipeBook} />
			<NavButton label="Recipe Book" path="/recipe-book" icon={recipeBook} />
			<NavButton label="User Profile" path="/user-profile" icon={recipeBook} />
		</nav>
	);
}

function NavButton({ label, path, icon }) {
	return (
		<Link
			className="d-flex flex-column align-items-center text-decoration-none mx-3"
			to={path}
			style={{ width: "fit-content" }}
		>
			<div
				className="btn btn-primary"
				style={{
					aspectRatio: "1",
					padding: "0",
					margin: "0",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<img
					src={icon}
					alt={`${label} Icon`}
					style={{ height: "54px", padding: "0", margin: "0" }}
				/>
			</div>

			<span className="d-block small">{label}</span>
		</Link>
	);
}
