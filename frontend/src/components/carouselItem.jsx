import React from "react";
import { Card } from "react-bootstrap";
//import "./carouselItem.css"; // Import your custom CSS file

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
				overflow: "hidden",
				margin: "10px auto", // Adjust the margin to create the desired gap
				height: "10vh", // Set the fixed height as needed
				minWidth: "150px", // Set a minimum width for each item
			}}
			onClick={handleRecipeClick}
			className={isSelected ? "selected-recipe" : ""}
		>
			<Card.Body>
				<Card.Title className="text-center">{recipe.title}</Card.Title>
			</Card.Body>
		</Card>
	);
};

export default RecipeItem;
