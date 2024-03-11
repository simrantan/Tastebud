import React from "react";
import { Card } from "react-bootstrap";
import theme from "../theme/themes"; // Import your theme file

const RecipeItem = ({ recipe, onRecipeClick, isSelected }) => {
	const handleRecipeClick = () => {
		onRecipeClick(recipe.index);
	};

	return (
		<Card
			style={{
				borderRadius: theme.borderRadius, // Use border radius from your theme
				cursor: "pointer",
				border: isSelected
					? `2px solid ${theme.colors.accentBlue}`
					: "1px solid #ccc", // Use the blue accent color from your theme
				overflow: "hidden",
				fontFamily: theme.typography.body.fontFamily, // Use the Inter font family from your theme
				color: `#${theme.colors.background}`, // Use the shade of white from your theme
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
