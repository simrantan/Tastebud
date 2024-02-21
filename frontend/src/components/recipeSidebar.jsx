// RecipePanel.js
import React from "react";

const RecipePanel = ({ recipe }) => {
	if (!recipe) {
		return null;
	}

	return (
		<div className="recipe-panel">
			{/* Add your styling and formatting for the recipe display */}
			<h3>Recipe</h3>
			<p>{recipe.title}</p>
			<ul>
				{recipe.ingredients.map((ingredient, index) => (
					<li key={index}>{ingredient}</li>
				))}
			</ul>
		</div>
	);
};

export default RecipePanel;
