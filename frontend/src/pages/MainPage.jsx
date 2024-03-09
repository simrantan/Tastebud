// MainPage.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PreferenceCard from "../components/PreferenceCard.jsx";
import "./MainPage.css"; // Import the CSS file
import iconImage from "../assets/recipe-book.png"; // Adjust the path based on the file structure
import { useUser } from "../contexts/UserContext";

export default function MainPage() {
	const navigate = useNavigate();
	const { userData } = useUser();

	const handleButtonClick = () => {
		navigate("/recipe-book");
	};

	if (!userData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="main-container">
			<h1>MainPage</h1>
			<h2>Welcome, {userData.displayName}!</h2>
			<div className="header-button-container">
				<button className="square-button" onClick={handleButtonClick}>
					<img src={iconImage} alt="Recipe Book Icon" />
				</button>
				<span>Recipe Book</span>
			</div>

			<PreferenceCard />
		</div>
	);
}
