import React from "react";
import { Card, Image } from "react-bootstrap";

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
