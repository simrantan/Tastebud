// MainPage.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PreferenceCard from "../components/PreferenceCard.jsx";
import "./MainPage.css"; // Import the CSS file
import iconImage from "../assets/recipe-book.png"; // Adjust the path based on the file structure
import ChatsSidebar from "../components/ChatsSidebar.jsx";

export default function MainPage() {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		navigate("/recipe-book");
	};

	return (
		<div className="main-container">
			<h1>MainPage</h1>
			<div className="header-button-container">
				<button className="square-button" onClick={handleButtonClick}>
					<img src={iconImage} alt="Recipe Book Icon" />
				</button>
				<span>Recipe Book</span>
			</div>

			<ChatsSidebar />
			<PreferenceCard />
		</div>
	);
}
