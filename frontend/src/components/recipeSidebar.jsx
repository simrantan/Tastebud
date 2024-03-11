// RecipePanel.js
import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { useUser } from "../contexts/UserContext";

const RecipePanel = ({ recipe }) => {
	const [addedToRecipeBook, setAddedToRecipeBook] = useState(false);
	console.log("recipe in pane", JSON.stringify(recipe, null, 2));

	const { userData } = useUser();
	const userId = userData.id;

	if (!recipe) {
		return (
			<div className="recipe-panel">
				<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
				<h3>Recipe</h3>
				<p>No recipe selected</p>
			</div>
		);
	}

	const handleToggleRecipe = async () => {
		setAddedToRecipeBook(!addedToRecipeBook);

		if (!addedToRecipeBook) {
			await handleAddRecipe(recipe);
		} else {
			await handleRemoveRecipe(recipe.id);
		}
	};

	const handleAddRecipe = async (recipe) => {
		try {
			const response = await fetch(
				`http://localhost:3001/recipe_book/${userId}/add`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(recipe),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			toast.success(`${recipe.name} has been added to your Recipe Book!`);
		} catch (error) {
			console.error("Error adding recipe:", error.message);
		}
	};

	const handleRemoveRecipe = async (recipe) => {
		try {
			// Notify the server to remove the recipe from the user's recipe book
			const response = await fetch(
				`http://localhost:3001/recipe_book/${userId}/remove/${recipe.id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			toast.success(`${recipe.name} has been removed from your Recipe Book!`);
		} catch (error) {
			console.error("Error removing recipe:", error.message);
		}
	};

	return (
		<div
			className="recipe-panel d-flex flex-column justify-content-between"
			style={{ height: "100%", backgroundColor: "#FFF9F3" }}
		>
			<h3>{recipe.title}</h3>

			<div
				style={{
					overflowY: "auto",
					maxHeight: "calc(100% - 20px)",
					padding: "10px",
					backgroundColor: "#FFF9F3",
				}}
			>
				<div style={{}}>
					<h4>Ingredients</h4>
					<ul>
						{recipe.ingredients.map((ingredient, index) => (
							<li key={index}>{ingredient}</li>
						))}
					</ul>
				</div>
				<div>
					<h4>Directions</h4>
					<div>
						{recipe.directions.map((direction, index) => (
							<p key={index}>{direction}</p>
						))}
					</div>
				</div>
			</div>

			<Button
				onClick={handleToggleRecipe}
				variant={addedToRecipeBook ? "danger" : "primary"}
				style={{ flex: "none", marginTop: "14px" }}
			>
				{addedToRecipeBook ? "Remove from Recipe Book" : "Add to Recipe Book"}
			</Button>
		</div>
	);
};

export default RecipePanel;
