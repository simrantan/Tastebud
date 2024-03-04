// ConversationStarters.js

import React from "react";
import { Button } from "react-bootstrap";

const ConversationStarters = ({ onStartConversation }) => {
	const conversationOptions = [
		"Tell me a joke",
		"Recommend a recipe",
		"What's the weather like?",
	];

	return (
		<div>
			<p className="mb-3">Choose a conversation starter:</p>
			{conversationOptions.map((option, index) => (
				<Button
					key={index}
					variant="primary"
					className="mr-2 mb-2"
					onClick={() => onStartConversation(option)}
				>
					{option}
				</Button>
			))}
		</div>
	);
};

export default ConversationStarters;
