import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button, Card } from "react-bootstrap";
import "./carousel.css"; // Import your custom CSS file

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

	const RecipeItem = ({ recipe, onRecipeClick, isSelected }) => {
		const handleRecipeClick = () => {
			onRecipeClick(recipe.index);
		};
		const customButtonStyle = {
			backgroundColor: "#FFF",
			borderColor: "#573c56",
			color: "#573c56",
		};

		return (
			<Button
				style={{
					...customButtonStyle,
					borderRadius: "5px",
					cursor: "pointer",
					border: isSelected ? "2px solid #007bff" : "1px solid #ccc",
					overflow: "hidden",
					margin: "10px auto",
					height: "14vh",
					minWidth: "150px",
				}}
				onClick={handleRecipeClick}
				className={isSelected ? "selected-recipe" : ""}
			>
				{recipe.title}
			</Button>
		);
	};

	return (
		<Carousel responsive={responsive}>
			{recipes.map((recipe, index) => (
				<RecipeItem
					key={index}
					index={index}
					recipe={recipe}
					onRecipeClick={() => handleRecipeClick(index)}
				/>
			))}
		</Carousel>
	);
};

export default RecipeCarousel;
