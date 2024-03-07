import React from "react";
import { Card, Image } from "react-bootstrap";

const RecipeItem = ({ recipe, onRecipeClick, isSelected }) => {
	const handleRecipeClick = () => {
		onRecipeClick(recipe.index);
	};

	return (
		<Card
			style={{
				borderRadius: "15px",
				cursor: "pointer",
				border: isSelected ? "2px solid #007bff" : "1px solid #ccc", // Highlight the selected recipe
				overflow: "hidden",
			}}
			onClick={handleRecipeClick}
		>
			<Image src={recipe.image} alt={recipe.name} fluid />
			<Card.Body>
				<Card.Text className="text-center">{recipe.name}</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default RecipeItem;
