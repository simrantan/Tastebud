import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // Import react-markdown

import "react-toastify/dist/ReactToastify.css";
import "./RecipeBook.css"; // Import the CSS file

export default function RecipeBook() {
	const userId = "00000000_sample_user";
	const navigate = useNavigate();

	const [recipeBook, setRecipeBook] = useState([]);

	const [showModal, setShowModal] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Get the user's recipe book from the backend
	useEffect(() => {
		fetch(`http://localhost:3001/recipe_book/${userId}`)
			.then((response) => response.json())
			.then((data) => {
				// Assuming data.recipes is an array of recipes
				const recipes = data || []; // Use an empty array if recipes is undefined
				setRecipeBook(recipes);
			})
			.catch((error) => {
				console.error("Error fetching recipe book:", error);
				// You may want to handle the error appropriately, e.g., display an error message
			});
		console.log(recipeBook);
	}, []); // Add userId as a dependency if it's used in the useEffect

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleRecipeClick = (recipe) => {
		setSelectedRecipe(recipe);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleHomepageButton = () => {
		navigate("/");
	};

	const handleRemoveFromRecipeBookModal = (recipeId) => {
		handleRemoveFromRecipeBook(recipeId);
		// Close the modal after removal
		handleCloseModal();
	};

	const handleRemoveFromRecipeBook = async (recipeId) => {
		// Find the selected recipe
		const removedRecipe = recipeBook.find((recipe) => recipe.id === recipeId);

		// Update recipeBook state by removing the selected recipe
		setRecipeBook((prevRecipes) =>
			prevRecipes.filter((recipe) => recipe.id !== recipeId)
		);

		// Show a notification
		toast.success(`${removedRecipe.name} has been removed from Recipe Book!`);

		try {
			// Notify the server to remove the recipe from the user's recipe book
			const response = await fetch(
				`http://localhost:3001/recipe_book/${userId}/${recipeId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						action: "remove",
						recipeInfo: {}, // You can send additional recipe information if needed
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Handle the response if needed
			const data = await response.json();
			console.log(data); // Log the success message from the server
		} catch (error) {
			console.error("Error removing recipe:", error.message);
		}
	};

	const filteredRecipes = recipeBook.filter((recipe) =>
		recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const groupRecipesByCuisine = () => {
		const groupedRecipes = {};
		filteredRecipes.forEach((recipe) => {
			const cuisine = recipe.cuisine;
			if (groupedRecipes[cuisine]) {
				groupedRecipes[cuisine].push(recipe);
			} else {
				groupedRecipes[cuisine] = [recipe];
			}
		});

		// Sort the cuisines alphabetically
		const sortedCuisines = Object.keys(groupedRecipes).sort();

		// Create a new object with sorted cuisines
		const sortedGroupedRecipes = {};
		sortedCuisines.forEach((cuisine) => {
			sortedGroupedRecipes[cuisine] = groupedRecipes[cuisine];
		});

		return sortedGroupedRecipes;
	};

	const groupedRecipes = groupRecipesByCuisine();

	return (
		<div>
			<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
			<div className="homepage-button">
				<Button variant="primary" onClick={handleHomepageButton}>
					Go to MainPage
				</Button>
			</div>
			<h2>Recipe Book</h2>
			<input
				type="text"
				placeholder="Search recipes..."
				value={searchQuery}
				onChange={handleSearchChange}
			/>
			{Object.keys(groupedRecipes).map((cuisine, index) => (
				<div key={`${cuisine}-${index}`} className="cuisine-container">
					<h3>{cuisine}</h3>
					<div className="recipe-container">
						{groupedRecipes[cuisine].map((recipe) => (
							<Card key={recipe.id} className="recipe-card">
								<Card.Img variant="top" src={recipe.picture_url} />
								<Card.Body>
									<Card.Title>{recipe.name}</Card.Title>
									<div className="button-container">
										<Button onClick={() => handleRecipeClick(recipe)}>
											View Recipe
										</Button>
										<Button
											variant="danger"
											onClick={() => handleRemoveFromRecipeBook(recipe.id)}
										>
											Remove
										</Button>
									</div>
								</Card.Body>
							</Card>
						))}
					</div>
				</div>
			))}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>{selectedRecipe?.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedRecipe && (
						<>
							<ReactMarkdown>{selectedRecipe?.text}</ReactMarkdown>
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => handleRemoveFromRecipeBookModal(selectedRecipe.id)}
					>
						Remove from Recipe Book
					</Button>
					<Button variant="secondary" onClick={handleCloseModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
