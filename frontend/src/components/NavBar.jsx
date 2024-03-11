import React from "react";
import { Link } from "react-router-dom";
import recipeBook from "../assets/recipe-book.png";

export default function NavBar({ setChatSidebarIsOpen }) {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between mb-3">
			<div
				className="d-flex flex-column align-items-center text-decoration-none mx-3"
				style={{ width: "fit-content" }}
				onClick={() => setChatSidebarIsOpen(true)}
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
						src={recipeBook}
						alt={`Previous Chats Icon`}
						style={{ height: "54px", padding: "0", margin: "0" }}
					/>
				</div>

				<span className="d-block small">Previous Chats</span>
			</div>

			<div className="d-flex justify-content-end ">
				<NavButton label="Chat" path="/" icon={recipeBook} />
				<NavButton label="Recipe Book" path="/recipe-book" icon={recipeBook} />
				<NavButton
					label="User Profile"
					path="/user-profile"
					icon={recipeBook}
				/>
			</div>
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
