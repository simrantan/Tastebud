import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeItem from "./RecipeItem";

const RecipeCarousel = ({ recipes, onRecipeClick }) => {
	const [selectedRecipe, setSelectedRecipe] = useState(null);

	const responsive = {
		superLargeDesktop: {
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 4,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 2,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

	const handleRecipeClick = (recipe) => {
		if (!selectedRecipe) {
			setSelectedRecipe(recipe);
			onRecipeClick(recipe.name);
		}
	};

	return (
		<Carousel responsive={responsive}>
			{recipes.map((recipe, index) => (
				<RecipeItem
					key={index}
					recipe={recipe}
					onRecipeClick={() => handleRecipeClick(recipe)}
					disabled={selectedRecipe && selectedRecipe !== recipe}
				/>
			))}
		</Carousel>
	);
};

export default RecipeCarousel;
