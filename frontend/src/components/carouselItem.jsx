import React from "react";
import { Card, Image } from "react-bootstrap";

const RecipeItem = ({ index, recipe, onRecipeClick }) => {
	const handleRecipeClick = () => {
		onRecipeClick(index);
	};

	return (
		<Card
			style={{
				borderRadius: "15px",
				cursor: "pointer",
				border: "1px solid #ccc",
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
