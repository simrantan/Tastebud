// RecipePanel.js
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // Import react-markdown

import { Button, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const RecipePanel = ({ recipe }) => {
	const [addedToRecipeBook, setAddedToRecipeBook] = useState(false);

	const userId = 1;

	if (!recipe) {
		return null;
	}

	const handleToggleRecipe = async () => {
		// Toggle the addedToRecipeBook state
		setAddedToRecipeBook(!addedToRecipeBook);

		if (!addedToRecipeBook) {
			// If the recipe is not in the recipe book, add it
			await handleAddRecipe(recipe);
		} else {
			// If the recipe is already in the recipe book, remove it
			await handleRemoveRecipe(recipe.id);
		}
	};

	const handleAddRecipe = async (recipe) => {
		try {
			// Notify the server to add the recipe from the user's recipe book
			const response = await fetch(
				`http://localhost:3001/recipe_book/${userId}/${recipe.id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						action: "add",
						recipeInfo: recipe,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Handle the response if needed
			const data = await response.json();
			// Show a notification
			toast.success(`${recipe.name} has been added to your Recipe Book!`);
		} catch (error) {
			console.error("Error removing recipe:", error.message);
		}
	};

	const handleRemoveRecipe = async (recipe) => {
		try {
			// Notify the server to add the recipe from the user's recipe book
			const response = await fetch(
				`http://localhost:3001/recipe_book/${userId}/${recipe.id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						action: "remove",
						recipeInfo: {},
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Handle the response if needed
			const data = await response.json();
			// Show a notification
			toast.success(`${recipe.name} has been removed from your Recipe Book!`);
		} catch (error) {
			console.error("Error removing recipe:", error.message);
		}
	};

	return (
		<div className="recipe-panel">
			<ToastContainer position="top-right" autoClose={3000} hideProgressBar />

			{/* Add your styling and formatting for the recipe display */}
			<h3>Recipe</h3>
			<p>{recipe.name}</p>
			<Card.Img variant="top" src={recipe.picture_url} />

			<ReactMarkdown>{recipe.text}</ReactMarkdown>

			<Button
				onClick={handleToggleRecipe}
				variant={addedToRecipeBook ? "danger" : "primary"}
			>
				{addedToRecipeBook ? "Remove from Recipe Book" : "Add to Recipe Book"}
			</Button>
		</div>
	);
};

export default RecipePanel;
