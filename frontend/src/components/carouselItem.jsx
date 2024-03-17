import React from "react";
import { Card, Image } from "react-bootstrap";
import "./carouselItem.css"; // Import your custom CSS file

const RecipeItem = ({ recipe, onRecipeClick, isSelected }) => {
	const handleRecipeClick = () => {
		onRecipeClick(recipe.index);
	};

	return (
		<Card
			style={{
				borderRadius: "5px",
				cursor: "pointer",
				border: isSelected ? "2px solid #007bff" : "1px solid #ccc",

				height: "10vh", // Set the fixed height as needed
				width: "15vw",
			}}
			onClick={handleRecipeClick}
			className={isSelected ? "selected-recipe" : ""}
		>
			<Card.Body>
				<Card.Title className="text-center">{recipe}</Card.Title>
			</Card.Body>
		</Card>
	);
};

export default RecipeItem;
