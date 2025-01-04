import React from "react";
import PreferenceCard from "../components/PreferenceCard.jsx";
import ChatsMain from "../components/ChatsMain.jsx";

export default function MainPage() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column", // Stacks content vertically
				height: "80vh", // Makes the container smaller than the viewport
				paddingBottom: "10px", // Adds padding at the bottom of the container
				overflowY: "auto", // Allows scrolling if the content overflows
			}}
		>
			<PreferenceCard />
			<ChatsMain />
		</div>
	);
}
