// MainPage.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PreferenceCard from "../components/PreferenceCard.jsx";
import ChatsMain from "../components/ChatsMain.jsx";

export default function MainPage() {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		navigate("/recipe-book");
	};

	return (
		<div className="main-container">
			<h1>MainPage</h1>
			<Button onClick={handleButtonClick}>Go to RecipeBook</Button>

			<PreferenceCard />
			<ChatsMain />
		</div>
	);
}
