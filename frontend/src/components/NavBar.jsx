import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import recipeBook from "../assets/recipe-book.png";
import userProfile from "../assets/user.png";
import chatBubble from "../assets/chat.png";
import home from "../assets/home.png";

import tasteBudLogo from "../assets/tastebud-icon-red.png"; // Import your PNG logo
import "@fontsource/karla"; // Defaults to weight 400

export default function NavBar({ setChatSidebarIsOpen }) {
	const { isLoggedIn } = useUser();

	return (
		<nav
			className="navbar navbar-expand-lg navbar-white bg-white d-flex justify-content-between mb-3"
			style={{
				padding: "10px 20px 10px 20px", // Added padding on sides and top
				backgroundColor: "#f8f9fa", // Added background color
				boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Added shadow
			}}
		>
			<div
				className="d-flex flex-column align-items-center text-decoration-none mx-3"
				style={{ width: "fit-content", paddingTop: "20px" }}
				onClick={() => setChatSidebarIsOpen(true)}
			>
				{isLoggedIn() && (
					<>
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
								transition: "transform 0.3s",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform = "scale(1.1)")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform = "scale(1)")
							}
						>
							<img
								src={chatBubble}
								alt={`Previous Chats Icon`}
								style={{ height: "54px", padding: "8px", margin: "0" }}
							/>
						</div>
						<span
							className="d-block small"
							style={{ color: "#d87e79", userSelect: "none" }}
						>
							Previous Chats
						</span>
					</>
				)}
			</div>
			<div
				style={{
					position: "sticky",
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					alignItems: "center",
					height: "100px", // Increased height to give more space
					paddingTop: "20px", // Increased padding to push elements down
					userSelect: "none",
				}}
			>
				<div
					style={{
						fontFamily: "Karla",
						fontSize: "42px", // Adjusted size
						fontWeight: "bold", // Bolded text
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
			<div
				className="d-flex justify-content-end"
				style={{ paddingTop: "20px" }}
			>
				{isLoggedIn() && (
					<>
						<NavButton label="Homepage" path="/newConversation" icon={home} />
						<NavButton
							label="Recipe Book"
							path="/recipe-book"
							icon={recipeBook}
						/>
						<NavButton
							label="User Profile"
							path="/user-profile"
							icon={userProfile}
						/>
					</>
				)}
			</div>
		</nav>
	);
}

function NavButton({ label, path, icon }) {
	return (
		<Link
			className="d-flex flex-column align-items-center text-decoration-none mx-3"
			to={{
				pathname: path,
			}}
			style={{ width: "fit-content" }}
		>
			<div
				className="btn btn-custom"
				style={{
					aspectRatio: "1",
					padding: "0",
					margin: "0",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#d87e79",
					outline: "none",
					transition: "transform 0.3s",
				}}
				onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
				onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
			>
				<img
					src={icon}
					alt={`${label} Icon`}
					style={{ height: "54px", padding: "6px", margin: "0" }}
				/>
			</div>

			<span
				className="d-block small"
				style={{ color: "#d87e79", userSelect: "none" }}
			>
				{label}
			</span>
		</Link>
	);
}
