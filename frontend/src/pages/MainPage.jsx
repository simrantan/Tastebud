// MainPage.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		navigate("/recipe-book");
	};

	return (
		<div className="MainPage container">
			<h1>MainPage</h1>
			<Button onClick={handleButtonClick}>Go to RecipeBook</Button>
		</div>
	);
}
