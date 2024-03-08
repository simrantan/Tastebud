import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import RecipePanel from "./recipeSidebar";
import RecipeCarousel from "./carousel";
import ConversationStarters from "./conversationStarters";

const hardcodedUserId = "00000000_sample_user";
const API_CHAT_ENDPOINT = "http://localhost:3001/chat";
const AI_SIMULATION_ENDPOINT = `${API_CHAT_ENDPOINT}/${hardcodedUserId}/sample_chat/message`;

export default function ChatsMain() {
	const [userInput, setUserInput] = useState("");
	const [chatHistory, setChatHistory] = useState([{}]);
	const [recipePanelData, setRecipePanelData] = useState({ recipes: [] });
	const [receivedIsRecipeList, setReceivedIsRecipeList] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [showConversationStarters, setShowConversationStarters] =
		useState(true);

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleInputChange = (e) => {
		setUserInput(e.target.value);
	};

	const fetchAIResponse = useCallback(
		async ({ userMessage }) => {
			try {
				const response = await fetch(AI_SIMULATION_ENDPOINT, {
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

				if (responseData.Messages && responseData.Messages.length > 0) {
					const lastMessage =
						responseData.Messages[responseData.Messages.length - 1];
					const parsedContent = JSON.parse(lastMessage.Content);

					const isRecipeList = parsedContent.isRecipeList;
					const receivedChatTitle = parsedContent.chatTitle;
					const receivedContent = parsedContent.Message;

					setReceivedIsRecipeList(isRecipeList);

					if (receivedIsRecipeList) {
						// Set recipePanelData to the list of recipes
						setRecipePanelData({ recipes: parsedContent.Recipes });
					}

					// Add the AI message to chatHistory
					const newAIMessage = {
						role: "ai",
						content: receivedContent,
					};

					const updatedChatHistory = [...chatHistory, newAIMessage];

					setChatHistory(updatedChatHistory);

					scrollToBottom();
				}
			} catch (error) {
				console.error("Error fetching AI response:", error);
			}
		},
		[chatHistory]
	);

	const handleRecipeSelection = useCallback(
		async (recipeName) => {
			try {
				const index = recipePanelData.recipes.findIndex(
					(recipe) => recipe.title === recipeName
				);

				if (index !== -1) {
					const newUserMessage = {
						role: "user",
						content: recipeName,
					};

					const updatedChatHistory = [...chatHistory, newUserMessage];

					setChatHistory(updatedChatHistory);

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

			setShowConversationStarters(false); // Hide conversation starters
		},
		[chatHistory, fetchAIResponse]
	);

	const handleSendMessage = () => {
		if (userInput.trim() === "") return;

		const newUserMessage = {
			role: "user",
			content: userInput,
		};

		const updatedChatHistory = [...chatHistory, newUserMessage];

		setChatHistory(updatedChatHistory);
		setUserInput("");

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
							{receivedIsRecipeList && recipePanelData && (
								<RecipeCarousel
									recipes={recipePanelData.recipes}
									onRecipeClick={(index) => {
										const selectedRecipe = recipePanelData.recipes[index];
										setRecipePanelData(index);
										setSelectedRecipe(selectedRecipe);
										handleRecipeSelection(selectedRecipe.title);
									}}
									selectedRecipe={selectedRecipe}
								/>
							)}
							{!isRecipeList && (
								<>
									{showConversationStarters && chatHistory.length <= 1 && (
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
								</>
							)}
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
				{receivedIsRecipeList && selectedRecipe && (
					<RecipePanel selectedRecipe={selectedRecipe} />
				)}
			</Row>
		</Container>
	);
}
