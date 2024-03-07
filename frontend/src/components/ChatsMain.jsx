import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import RecipePanel from "./recipeSidebar";
import RecipeCarousel from "./RecipeCarousel";
import ConversationStarters from "./conversationStarters";

const hardcodedUserId = 1;
const API_CHAT_ENDPOINT = "http://localhost:3001/chat";
const AI_SIMULATION_ENDPOINT = `${API_CHAT_ENDPOINT}/${hardcodedUserId}`;

export default function ChatsMain() {
	const [userInput, setUserInput] = useState("");
	const [chatHistory, setChatHistory] = useState([{}]);
	const [canSendAiMessage, setCanSendAiMessage] = useState(true);
	const [recipePanelData, setRecipePanelData] = useState(null);
	const [isRecipeList, setIsRecipeList] = useState(false);
	const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);
	const [selectedRecipeName, setSelectedRecipeName] = useState(null);
	const [selectedRecipe, setSelectedRecipe] = useState(null);

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleInputChange = (e) => {
		setUserInput(e.target.value);
	};

	const fetchAIResponse = async ({ chatHistory, userMessage }) => {
		try {
			const response = await fetch(API_CHAT_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userMessage,
					// Include other necessary data for the backend
				}),
			});

			const responseData = await response.json();

			const aiMessage = {
				role: "assistant",
				content: responseData.message.content,
			};

			setChatHistory((prevChatHistory) => [...prevChatHistory, aiMessage]);
			scrollToBottom();
		} catch (error) {
			console.error("Error fetching AI response:", error);
		}
	};

	const handleBackendResponse = async (data) => {
		setIsRecipeList(data.isRecipeList);

		if (data.isRecipeList) {
			const updatedRecipePanelData = await fetchRecipePanelData();
			setRecipePanelData(updatedRecipePanelData);
		} else {
			// Handle non-recipe messages from AI if needed
		}
	};

	const fetchRecipePanelData = async () => {
		const response = await fetch(`${API_CHAT_ENDPOINT}/recipe-panel`);
		const data = await response.json();

		return data;
	};

	const handleRecipeSelection = useCallback(
		async (recipeName) => {
			try {
				// Find the selected recipe index based on the name
				const index = recipePanelData.recipes.findIndex(
					(recipe) => recipe.title === recipeName
				);

				if (index !== -1) {
					// Set the selected recipe index and name in the state
					setSelectedRecipeIndex(index);
					setSelectedRecipeName(recipeName);

					// Send the selected recipe name to the AI as a user message
					const newUserMessage = {
						role: "user",
						content: recipeName,
					};

					const updatedChatHistory = [...chatHistory, newUserMessage];

					setChatHistory(updatedChatHistory);
					setCanSendAiMessage(true);

					fetchAIResponse({
						chatHistory: updatedChatHistory,
						userMessage: newUserMessage,
					});
				}
			} catch (error) {
				console.error("Error selecting recipe:", error);
			}
		},
		[chatHistory, fetchAIResponse, recipePanelData.recipes]
	);

	const handleStartConversation = useCallback(
		(starterOption) => {
			setChatHistory((prevChatHistory) => [
				...prevChatHistory,
				{ role: "user", content: starterOption },
			]);

			fetchAIResponse({
				chatHistory: [...chatHistory, { role: "user", content: starterOption }],
				userMessage: { role: "user", content: starterOption },
			});
		},
		[chatHistory, fetchAIResponse]
	);

	useEffect(() => {
		const simulateBackendResponse = async () => {
			try {
				const responseData = await fetch(AI_SIMULATION_ENDPOINT).then(
					(response) => response.json()
				);

				console.log("Simulated Backend Response:", responseData);

				handleBackendResponse(responseData);
			} catch (error) {
				console.error("Error simulating backend response:", error);
			}
		};

		simulateBackendResponse();
		scrollToBottom();
	}, []);

	const handleSendMessage = () => {
		if (userInput.trim() === "") return;

		const newUserMessage = {
			role: "user",
			content: userInput,
		};

		const updatedChatHistory = [...chatHistory, newUserMessage];

		setChatHistory(updatedChatHistory);
		setUserInput("");
		setCanSendAiMessage(true);

		fetchAIResponse({
			chatHistory: updatedChatHistory,
			userMessage: newUserMessage,
		});
	};

	return (
		<Container fluid className="py-5" style={{ backgroundColor: "#eee" }}>
			<Row className="justify-content-center">
				<Col md="10" lg="8" xl="6">
					<Card
						id="chat2"
						style={{
							borderRadius: "15px",
							border: "1px solid #ccc",
							overflow: "hidden",
						}}
					>
						<Card.Header className="d-flex justify-content-between align-items-center p-3">
							<h5 className="mb-0">Chat</h5>
						</Card.Header>
						<Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
							{isRecipeList ? (
								<RecipeCarousel
									recipes={recipePanelData.recipes}
									onRecipeClick={(index) => {
										const selectedRecipe = recipePanelData.recipes[index];
										setSelectedRecipeIndex(index);
										setSelectedRecipe(selectedRecipe);
										handleRecipeSelection(selectedRecipe.title);
									}}
									selectedRecipe={selectedRecipe}
								/>
							) : (
								<ConversationStarters
									onStartConversation={handleStartConversation}
								/>
							)}
							{chatHistory.map((message, index) => (
								<div
									key={index}
									className={`d-flex flex-row justify-content-${
										message.role === "user" ? "end" : "start"
									} mb-4`}
								>
									<div>
										<p
											className={`small p-2 ms-3 mb-1 rounded-3 ${
												message.role === "user"
													? "text-white bg-primary"
													: "bg-light"
											}`}
										>
											{message.content}
										</p>
									</div>
								</div>
							))}
							<div ref={messagesEndRef} />
						</Card.Body>
						<Card.Footer className="text-muted d-flex justify-content-start align-items-center p-3">
							<Form.Control
								type="text"
								className="form-control-lg"
								id="exampleFormControlInput1"
								placeholder="Type message"
								value={userInput}
								onChange={handleInputChange}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleSendMessage();
									}
								}}
							/>
							<a
								className="ms-1 text-muted"
								href="#!"
								onClick={handleSendMessage}
							>
								<i className="fas fa-paper-plane"></i>
							</a>
						</Card.Footer>
					</Card>
				</Col>
				{isRecipeList && selectedRecipe && (
					<RecipePanel selectedRecipe={selectedRecipe} />
				)}
			</Row>
		</Container>
	);
}
