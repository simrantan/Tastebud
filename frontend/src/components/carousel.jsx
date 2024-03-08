import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeItem from "./carouselItem";

const RecipeCarousel = ({ recipes, onRecipeClick }) => {
	const responsive = {
		superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
		desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
		tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
		mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
	};

	const handleRecipeClick = (index) => {
		onRecipeClick(index); // Send the recipe index and name to the parent component
	};

	return (
		<Carousel responsive={responsive}>
			{recipes.map((recipe, index) => (
				<RecipeItem
					key={index}
					index={index} // Pass the index to the RecipeItem component
					recipe={recipe}
					onRecipeClick={() => handleRecipeClick(index)}
				/>
			))}
		</Carousel>
	);
};

export default RecipeCarousel;
