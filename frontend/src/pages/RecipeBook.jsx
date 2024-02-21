import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "./RecipeBook.css"; // Import the CSS file

export default function RecipeBook() {
	const userId = 1; // Hardcoded user ID for now -- this will come from useContext
	const navigate = useNavigate();

	const [recipeBook, setRecipeBook] = useState();
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [groupedRecipes, setGroupedRecipes] = useState();
	const [showModal, setShowModal] = useState(false);

	// Get the user's recipe book from the backend
	useEffect(() => {
		fetch(`http://localhost:3001/recipe_book/${userId}`)
			.then((response) => response.json())
			.then((recipeBook) => {
				// recipeBook is an object with a "recipes" key that contains an array of recipes
				setRecipeBook(recipeBook);
			});
	}, []);

	// Update the filteredRecipes state when the searchQuery changes
	useEffect(() => {
		// If we haven't yet gotten the recipe book from the backend, don't do anything
		if (!recipeBook) return;

		// If there's no search query, just show the entire recipe book
		if (!searchQuery) {
			setGroupedRecipes(recipeBook);
			return;
		}

		const filteredRecipes = recipeBook.filter((recipe) =>
			recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		let groupedRecipes = {};

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

		setGroupedRecipes(sortedGroupedRecipes);
	}, [recipeBook, searchQuery]);

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

	const handleRemoveFromRecipeBook = (recipeId) => {
		let removedRecipe = null;
		const updatedRecipeBook = {};

		for (const cuisine in recipeBook) {
			if (recipeBook.hasOwnProperty(cuisine)) {
				const updatedRecipes = [];
				for (const recipe of recipeBook[cuisine]) {
					if (recipe.id === recipeId) {
						removedRecipe = recipe;
					} else {
						updatedRecipes.push(recipe);
					}
				}
				updatedRecipeBook[cuisine] = updatedRecipes;
			}
		}
		setRecipeBook(updatedRecipeBook);

		// Show a notification
		toast.success(`${removedRecipe.name} has been removed from Recipe Book!`);

		// Close the modal after removal
		handleCloseModal();
	};

	// If we haven't yet gotten the recipes from the backend...
	if (!groupedRecipes) {
		return <div>Loading...</div>;
	}

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

			{Object.keys(groupedRecipes).map((cuisine) => (
				<div key={cuisine} className="cuisine-container">
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
							<p>Recipe Details:</p>
							<div dangerouslySetInnerHTML={{ __html: selectedRecipe?.text }} />
							<Button
								variant="danger"
								onClick={() => handleRemoveFromRecipeBook(selectedRecipe.id)}
							>
								Remove from Recipe Book
							</Button>
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
