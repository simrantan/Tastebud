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

	// Fetch the user's chats from the backend
	useEffect(() => {
		fetch(`${API_URL}/${userData.id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			})
			.then((user) => {
				setChats(user.chats);
				// console.log(user.chats[0]);
			})
			.catch((error) => {
				console.error("Error fetching chats:", error.message);
				throw error;
			});
	}, [userData.id]);

	function toggleDrawer() {
		setChatSidebarIsOpen(!chatSidebarIsOpen);
	}

	return (
		<>
			<div
				id="myDrawer"
				className={`drawer ${
					chatSidebarIsOpen ? "open" : ""
				} d-flex flex-column`}
			>
				<div className="d-flex justify-content-ends p-3 align-items-top">
					<h2 className="text-light">My Chats</h2>
					<button className="btn" onClick={toggleDrawer}>
						x
					</button>
				</div>

				{/* Create an entry for each conversation */}
				{chats.map((chat) => (
					<SidebarEntry chat={chat} key={chat.id} />
				))}

				<Link to="/newConversation">
					<Button variant="light" className="text-dark">
						Create New Chat
					</Button>
				</Link>
			</div>
		</>
	);
}

function SidebarEntry({ chat }) {
	return (
		<Link
			to={`/${chat.id}`}
			className="container my-1 p-1 text-decoration-none position-relative"
			style={{
				backgroundColor: "#ddd",
				height: "90px",
				width: "94%",
				borderRadius: "10px",
				color: "black",
				position: "relative",
				display: "flex",
				alignItems: "center",
			}}
		>
			<h4 style={{ paddingLeft: "10px" }}>{chat.name}</h4>
			<img
				className="arrow"
				src={require("../assets/arrow.svg").default}
				alt="Arrow"
			/>
		</Link>
	);
}
