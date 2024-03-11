import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ReactMarkdown from "react-markdown";

import recipeImage from "../assets/cuisines/other.jpeg";

import "react-toastify/dist/ReactToastify.css";
import "./RecipeBook.css";

export default function RecipeBook() {
	const navigate = useNavigate();
	const { userData } = useUser();

	const userId = userData.id;
	const [recipeBook, setRecipeBook] = useState([]);

	const [showModal, setShowModal] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetch(`http://localhost:3001/recipe_book/${userId}`)
			.then((response) => response.json())
			.then((data) => {
				const recipes = data || [];
				setRecipeBook(recipes);
			})
			.catch((error) => {
				console.error("Error fetching recipe book:", error);
			});
	}, [userId]);

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
		handleCloseModal();
	};

	const handleRemoveFromRecipeBook = async (recipeId) => {
		const removedRecipe = recipeBook.find((recipe) => recipe.id === recipeId);
		setRecipeBook((prevRecipes) =>
			prevRecipes.filter((recipe) => recipe.id !== recipeId)
		);

		toast.success(`${removedRecipe.title} has been removed from Recipe Book!`);

		try {
			const response = await fetch(
				`http://localhost:3001/recipe_book/${userId}/remove/${recipeId}`,
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
			console.log(data);
		} catch (error) {
			console.error("Error removing recipe:", error.message);
		}
	};

	const generateImagePath = (cuisine) => {
		let imagePath = `../../../cuisines/${cuisine}.jpeg`;

		// Check if the file exists, if not, use the default image
		fetch(imagePath, { method: "HEAD" })
			.then((response) => {
				if (!response.ok) {
					// File not found, use default image
					imagePath = `../../../cuisines/other.jpeg`;
				}
			})
			.catch((error) => {
				// Fetch error, use default image
				imagePath = `../../../cuisines/other.jpeg`;
			});

		return imagePath;
	};

	const filteredRecipes = recipeBook.filter(
		(recipe) =>
			recipe &&
			recipe.title &&
			recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
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

		const sortedCuisines = Object.keys(groupedRecipes).sort();

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

			<div style={{ marginLeft: "300px", marginRight: "300px" }}>
				<h2 style={{ marginBottom: "20px" }}>Recipe Book</h2>
				<input
					type="text"
					placeholder="Search recipes..."
					value={searchQuery}
					onChange={handleSearchChange}
					style={{
						padding: "10px",
						marginBottom: "20px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						width: "100%",
					}}
				/>

				{Object.keys(groupedRecipes).map((cuisine, index) => (
					<div
						key={`${cuisine}-${index}`}
						className="cuisine-container"
						style={{ marginBottom: "30px" }}
					>
						<h3 style={{ marginBottom: "15px" }}>{cuisine}</h3>
						<div className="recipe-container">
							{groupedRecipes[cuisine].map((recipe) => (
								<Card
									key={recipe.id}
									className="recipe-card"
									style={{ marginBottom: "15px" }}
								>
									<Card.Img
										variant="top"
										src={generateImagePath(recipe.cuisine)}
									/>
									<Card.Body>
										<Card.Title>{recipe.title}</Card.Title>
										<div className="button-container">
											<Button
												onClick={() => handleRecipeClick(recipe)}
												variant="info"
												style={{ marginRight: "10px" }}
											>
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
			</div>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>{selectedRecipe?.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedRecipe && (
						<>
							<h4>Ingredients:</h4>
							<ul>
								{selectedRecipe.ingredients.map((ingredient, index) => (
									<li key={index}>{ingredient}</li>
								))}
							</ul>
							<h4>Directions:</h4>
							<ul>
								{selectedRecipe.directions.map((direction, index) => (
									<li key={index}>{direction}</li>
								))}
							</ul>
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
