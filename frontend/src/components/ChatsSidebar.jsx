import React, { useState, useEffect } from "react";
import "./ChatsSidebar.css";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

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
				style={{ backgroundColor: "#573C56" }}
			>
				<div className="d-flex justify-content-ends p-3 align-items-top">
					<h2 className="text-light">Chats</h2>

					<button
						className="btn"
						onClick={toggleDrawer}
						style={{
							marginLeft: "auto",
							color: "white",
							fontWeight: "bold",
							fontSize: "1.5rem",
							border: "none",
						}}
					>
						x
					</button>
				</div>

				{/* Create an entry for each conversation */}
				{chats.map((chat) => (
					<SidebarEntry chat={chat} key={chat.id} />
				))}
			</div>
		</>
	);
}

function SidebarEntry({ chat }) {
	return (
		<Link
			// TODO: Update the path to the chat page
			to={`/`}
			className="container my-2 p-3 text-decoration-none"
			style={{
				backgroundColor: "#ddd",
				height: "100px",
				width: "90%",
				borderRadius: "10px",
				color: "black",
			}}
		>
			<h4>{chat.name}</h4>
		</Link>
	);
}
