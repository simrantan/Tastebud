// MainPage.jsx
import React, { useEffect } from "react";
import PreferenceCard from "../components/PreferenceCard.jsx";
import { useUser } from "../contexts/UserContext";
import ChatsSidebar from "../components/ChatsSidebar.jsx";
import ChatsMain from "../components/ChatsMain.jsx";

export default function MainPage({ chatSidebarIsOpen, setChatSidebarIsOpen }) {
	const { userData } = useUser();

	return (
		<div className="container">
			<h2>Welcome, {userData.displayName || "Chef"}!</h2>

			<ChatsSidebar
				chatSidebarIsOpen={chatSidebarIsOpen}
				setChatSidebarIsOpen={setChatSidebarIsOpen}
			/>
			<PreferenceCard />
			<ChatsMain />
		</div>
	);
}
