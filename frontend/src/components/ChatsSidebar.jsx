import React, { useState, useEffect } from "react";
import "./ChatsSidebar.css";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Button from "react-bootstrap/Button"; // Import the Button component

const API_URL = "http://localhost:3001/user";

export default function ChatsSidebar({
	chatSidebarIsOpen,
	setChatSidebarIsOpen,
}) {
	const { userData } = useUser();
	const [chats, setChats] = useState([]);
	const [newChatCount, setNewChatCount] = useState(0);

	// Fetch the user's chats from the backend
	useEffect(() => {
		if (userData && userData.id) {
			fetch(`${API_URL}/${userData.id}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					return response.json();
				})
				.then((user) => {
					// Order chats by their created_by field
					setChats(
						user.chats.sort((a, b) => (a.created_by > b.created_by ? 1 : -1))
					);
				})
				.catch((error) => {
					console.error("Error fetching chats:", error.message);
					throw error;
				});
		}
		// Run when userData is updated and when the sidebar is opened/closed
	}, [userData, chatSidebarIsOpen]);

	function toggleDrawer() {
		setChatSidebarIsOpen(!chatSidebarIsOpen);
	}

	return (
		<>
			<div
				id="myDrawer"
				className={`drawer ${
					chatSidebarIsOpen ? "open" : ""
				} d-flex flex-column justify-content-between`}
				style={{
					height: "100vh",
					zIndex: 1000,
				}}
			>
				<div
					className="d-flex justify-content-between p-3 pb-1 align-items-top"
					style={{ width: "100%" }}
				>
					<h2 className="text-light">My Chats</h2>
					<button
						className="btn btn-outline-light btn-lg"
						style={{ border: "none", marginTop: "-10px" }}
						onClick={toggleDrawer}
					>
						x
					</button>
				</div>

				<div className="m-0 p-0" style={{ flex: "none" }}>
					<Link
						to={`/newConversation:${newChatCount}`}
						onClick={() => {
							setNewChatCount((prevCount) => prevCount + 1);
							toggleDrawer();
						}}
					>
						<Button variant="light" className="text-dark m-0 mb-2">
							Create New Chat
						</Button>
					</Link>
				</div>

				<div style={{ flex: 1, overflowY: "auto" }}>
					{/* Create an entry for each conversation */}
					{chats.map((chat) => (
						<SidebarEntry
							chat={chat}
							key={chat.id}
							toggleDrawer={toggleDrawer}
						/>
					))}
				</div>
			</div>
		</>
	);
}

function SidebarEntry({ chat, toggleDrawer }) {
	return (
		<Link
			to={`/${chat.id}`}
			className="container my-1 p-3 text-decoration-none position-relative"
			style={{
				backgroundColor: "#f0f0f0",
				height: "90px",
				width: "94%",
				borderRadius: "10px",
				color: "black",
				position: "relative",
				display: "flex",
				alignItems: "center",
				boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
				textDecoration: "none",
			}}
			onClick={toggleDrawer} // Close sidebar when clicked
		>
			<div style={{ flex: 1 }}>
				<h4 style={{ margin: 0, fontSize: "1.2rem" }}>{chat.name}</h4>
			</div>

			<img
				className="arrow"
				src={require("../assets/arrow.svg").default}
				alt="Arrow"
			/>
		</Link>
	);
}
