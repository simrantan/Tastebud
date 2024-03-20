import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import recipeBook from "../assets/recipe-book.png";
import userProfile from "../assets/user.png";
import chatBubble from "../assets/chat.png";
import home from "../assets/home.png";

import { useParams } from "react-router-dom";
import tasteBudLogo from "../assets/tastebud-icon-red.png"; // Import your PNG logo
import "@fontsource/karla"; // Defaults to weight 400

export default function NavBar({ setChatSidebarIsOpen }) {
	const location = useLocation();

	// Extracting the pathname from the location object
	const path = location.pathname;
	const navigate = useNavigate();

	return (
		<nav className="navbar navbar-expand-lg navbar-white bg-white d-flex justify-content-between mb-3">
			<div
				className="d-flex flex-column align-items-center text-decoration-none mx-3"
				style={{ width: "fit-content" }}
				// TODO: shouldn't do this if no user logged in
				onClick={() => setChatSidebarIsOpen(true)}
			>
				<div
					className="btn btn-custom" // Change btn-primary to btn-custom
					style={{
						aspectRatio: "1",
						padding: "0",
						margin: "0",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#d87e79", // Set the background color
						outline: "none", // Remove the outline
					}}
				>
					<img
						src={chatBubble}
						alt={`Previous Chats Icon`}
						style={{ height: "54px", padding: "8px", margin: "0" }}
					/>
				</div>

				<span className="d-block small" style={{ color: "#d87e79" }}>
					Previous Chats
				</span>
			</div>
			<div
				style={{
					position: "sticky",
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					alignItems: "center",
					height: "76px",
					paddingBottom: "21px",
				}}
			>
				<div
					style={{
						fontFamily: "Karla",
						fontSize: "36px",
					}}
				>
					TasteBud
				</div>
				<img
					src={tasteBudLogo}
					alt="TasteBud Logo"
					style={{ width: "55px", height: "55px" }}
				/>
			</div>
			<div style={{ height: "76px" }}></div>{" "}
			<div className="d-flex justify-content-end ">
				{/* <NavButton label="Chat" path="/" icon={chatBubble} /> */}
				<NavButton label="Homepage" path="/newConversation" icon={home} />
				<NavButton
					label="Recipe Book"
					path="/recipe-book"
					icon={recipeBook}
				/>{" "}
				<NavButton
					label="User Profile"
					path="/user-profile"
					icon={userProfile}
				/>
			</div>
		</nav>
	);
}

function NavButton({ label, path, icon, prevChatId = null }) {
	return (
		<Link
			className="d-flex flex-column align-items-center text-decoration-none mx-3"
			to={{
				pathname: path,
			}}
			style={{ width: "fit-content" }}
		>
			<div
				className="btn btn-custom" // Change btn-primary to btn-custom
				style={{
					aspectRatio: "1",
					padding: "0",
					margin: "0",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#d87e79", // Set the background color
					outline: "none", // Remove the outline
				}}
			>
				<img
					src={icon}
					alt={`${label} Icon`}
					style={{ height: "54px", padding: "6px", margin: "0" }}
				/>
			</div>

			<span className="d-block small" style={{ color: "#d87e79" }}>
				{label}
			</span>
		</Link>
	);
}
