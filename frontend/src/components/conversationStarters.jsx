// ConversationStarters.js

import React from "react";
import { Button } from "react-bootstrap";

const ConversationStarters = ({ onStartConversation }) => {
	const conversationOptions = [
		"Recipes for Beginners",
		"Recommend a recipe",
		"What are trendy recipes?",
	];

	return (
		<div>
			<p className="mb-3">
				Hi Chef! I’m your personal Chef Assistant TasteBud. What are you
				thinking of making? I’ll take your preferences and dietary restrictions
				into account 😁. When you find a recipe you like, you can save it to
				your recipe book! View your recipe book by clicking the button in the
				top left corner… And you can always add more dietary preferences to your
				profile!
			</p>

			<div className="d-flex justify-content-around">
				{conversationOptions.map((option, index) => (
					<Button
						key={index}
						variant="outline-primary"
						className=" mb-2"
						onClick={() => onStartConversation(option)}
					>
						{option}
					</Button>
				))}
			</div>
		</div>
	);
};

export default ConversationStarters;
