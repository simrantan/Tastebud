import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "./RecipeBook.css"; // Import the CSS file

export default function RecipeBook({ userId }) {
	const navigate = useNavigate();

	const [recipeBook, setRecipeBook] = useState([
		{
			id: 11,
			name: "Banana Bread",
			chat_id: 111,
			text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "American",
		},
		{
			id: 22,
			name: "Cornbread",
			chat_id: 222,
			text: "## Cornbread Recipe\n\n**Ingredients:**\n- 1 cup (125g) all-purpose flour\n- 1 cup (150g) yellow cornmeal\n- 1/4 cup (50g) granulated sugar\n- 1 teaspoon salt\n- 1 tablespoon baking powder\n- 1 cup (240ml) milk\n- 1/3 cup (80ml) vegetable oil\n- 2 large eggs\n\n**Instructions:**\n1. Preheat your oven to 400°F (200°C). Grease a 9x9-inch baking dish.\n2. In a mixing bowl, whisk together the flour, cornmeal, sugar, salt, and baking powder.\n3. In a separate bowl, whisk together the milk, oil, and eggs.\n4. Add the wet ingredients to the dry ingredients and stir until just combined. Do not overmix.\n5. Pour the batter into the prepared baking dish.\n6. Bake in the preheated oven for 20 to 25 minutes, or until a toothpick inserted into the center comes out clean.\n7. Remove the cornbread from the oven and let it cool for 10 minutes before slicing.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "Indian",
		},
		{
			id: 33,
			name: "Apple Pie",
			chat_id: 333,
			text: "## Apple Pie Recipe\n\n**Ingredients:**\n- 1 recipe pastry for a 9-inch double-crust pie\n- 1/2 cup (100g) unsalted butter\n- 3 tablespoons all-purpose flour\n- 1/4 cup (60ml) water\n- 1/2 cup (100g) white sugar\n- 1/2 cup (100g) packed brown sugar\n- 8 Granny Smith apples - peeled, cored, and sliced\n\n**Instructions:**\n1. Preheat your oven to 425°F (220°C). Place the bottom crust in your pan.\n2. Melt the butter in a saucepan. Stir in flour to form a paste. Add water, white sugar, and brown sugar, and bring to a boil. Reduce temperature and let simmer.\n3. Place the apples in the prepared crust. Pour the sugar and butter mixture over the apples. Place the second crust on top of the apples.\n4. Bake in the preheated oven for 15 minutes. Reduce the temperature to 350°F (175°C) and continue baking for 35 to 45 minutes, until apples are soft.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "American",
		},
		{
			id: 24,
			name: "Banana Bread",
			chat_id: 111,
			text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "American",
		},
		{
			id: 25,
			name: "Banana Bread",
			chat_id: 111,
			text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "American",
		},
		{
			id: 26,
			name: "Banana Bread",
			chat_id: 111,
			text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "American",
		},
		{
			id: 27,
			name: "Banana Bread",
			chat_id: 111,
			text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
			picture_url: "https://placekitten.com/1000/1000",
			cuisine: "American",
		},
	]);

	const [showModal, setShowModal] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

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
		// Find the selected recipe
		const removedRecipe = recipeBook.find((recipe) => recipe.id === recipeId);

		// Update recipeBook state by removing the selected recipe
		setRecipeBook((prevRecipes) =>
			prevRecipes.filter((recipe) => recipe.id !== recipeId)
		);
		// Show a notification
		toast.success(`${removedRecipe.name} has been removed from Recipe Book!`);
		// Close the modal after removal
		handleCloseModal();
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
		return groupedRecipes;
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
