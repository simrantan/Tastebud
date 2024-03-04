import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeItem from "./RecipeItem";

const RecipeCarousel = ({ recipes, onRecipeClick }) => {
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

	return (
		<Carousel responsive={responsive}>
			{recipes.map((recipe, index) => (
				<RecipeItem
					key={index}
					index={index}
					recipe={recipe}
					onRecipeClick={onRecipeClick}
				/>
			))}
		</Carousel>
	);
};

export default RecipeCarousel;
