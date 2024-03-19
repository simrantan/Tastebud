import React, { useState, useEffect } from "react";
import "react-multi-carousel/lib/styles.css";
import { Button } from "react-bootstrap";
import "./carousel.css"; // Import your custom CSS file

const RecipeCarousel = ({ recipes, onRecipeClick }) => {
	const [hasBeenSelected, setHasBeenSelected] = useState(false);

	useEffect(() => {
		setHasBeenSelected(false);
	}, [recipes]);

	const handleRecipeClick = (index) => {
		setHasBeenSelected(true);
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
			whiteSpace: "wrap", // Prevent text wrapping
			overflow: "hidden",
			textOverflow: "ellipsis",
		};

		return (
			<Button
				style={{
					...customButtonStyle,
					borderRadius: "5px",
					cursor: "pointer",
					border: isSelected ? "2px solid #007bff" : "1px solid #ccc",
					margin: "5px",
					height: "5rem",
					maxWidth: "150px", // Set a minimum width for the button
					flex: "0 0 auto", // Prevent buttons from stretching
					alignContent: "center",
					transition: "background-color 0.3s", // Add transition for smoother color change
					backgroundColor: "#ffffff", // Initial background color
				}}
				onClick={handleRecipeClick}
				className={isSelected ? "selected-recipe" : ""}
				onMouseEnter={(e) => {
					e.target.style.backgroundColor = "#f0f0f0"; // Change background color on hover
				}}
				onMouseLeave={(e) => {
					e.target.style.backgroundColor = "#ffffff"; // Restore background color on mouse leave
				}}
			>
				{recipe}
			</Button>
		);
	};

	if (hasBeenSelected) {
		return <></>;
	}

	return (
		<div className="scrollable-container" style={{ overflowX: "auto" }}>
			<div className="d-flex">
				{recipes.map((recipe, index) => (
					<RecipeItem
						key={index}
						index={index}
						recipe={recipe}
						onRecipeClick={() => handleRecipeClick(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default RecipeCarousel;
