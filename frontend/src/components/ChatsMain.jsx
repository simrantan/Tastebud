import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import RecipePanel from "./recipeSidebar";
import RecipeCarousel from "./carousel";
import ConversationStarters from "./conversationStarters";
import { useParams } from "react-router-dom";

const AI_SIMULATION_ENDPOINT =
	"http://localhost:3001/chat/00000000_sample_user/message";

const get_chats = "http://localhost:3001/chat/00000000_sample_user";

export default function ChatsMain() {
	const { chatId } = useParams();

	const [userInput, setUserInput] = useState("");
	const [chatHistory, setChatHistory] = useState([{}]);
	const [recipePanelData, setRecipePanelData] = useState({ recipes: [] });
	const [receivedIsRecipeList, setReceivedIsRecipeList] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [showConversationStarters, setShowConversationStarters] =
		useState(true);

	const [curChatId, setCurChatId] = useState(chatId);

	const messagesEndRef = useRef(null);
	const userID = "00000000_sample_user";

	useEffect(() => {
		// Update state when the roomId parameter changes
		setCurChatId(chatId);
	}, [chatId]);

	useEffect(() => {
		// Set chat history with URL
		const fetchData = async () => {
			try {
				if (curChatId === undefined) {
					// Start a new conversation with conversation starters and empty chat history
					setChatHistory([]);
					setShowConversationStarters(true); // Show conversation starters
					return; // Skip the rest of the logic for new conversation
				}
				const response = await fetch(`${get_chats}/${curChatId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const chatData = await response.json();

				const allMessages = [];

				// Use a loop to iterate through messages
				for (const message of chatData.chats) {
					if (message.role === "user") {
						allMessages.push({
							role: message.role,
							content: message.content,
						});
					} else if (message.role === "assistant") {
						const assistantContent = JSON.parse(message.content).message;
						allMessages.push({
							role: "assistant",
							content: assistantContent,
						});
					}
				}
				if (allMessages.length >= 1) {
					setShowConversationStarters(false);
				}

				setChatHistory(allMessages);

				console.log("chatdata", JSON.stringify(chatData));
				console.log("chat", chatHistory);
			} catch (error) {
				console.error("Error fetching chat data:", error);
			}
		};

		fetchData();
	}, []);

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
				const response = await fetch(
					`http://localhost:3001/user/00000000_sample_user`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				// Update state with fetched preferences
				const preferences = {
					allergies: data.allergies,
					dislikes: data.dislikes,
					likes: data.likes,
				};

				try {
					const response2 = await fetch(AI_SIMULATION_ENDPOINT, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							message: userMessage.content, // Send only the content
							// Include other necessary data for the backend
							preferences: preferences,
							chatID: curChatId !== undefined ? curChatId : null,
							messages: chatHistory
						}),
					});

					const responseData = await response2.json();

					const newID = responseData.chat_id;
					setCurChatId(newID);

					if (responseData.messages && responseData.messages.length > 0) {
						const lastMessage =
							responseData.messages[responseData.messages.length - 1];

						const contentString = lastMessage.content; // Assuming content is a string
						const contentObject = JSON.parse(contentString);
						const isRecipeList = contentObject.isRecipeList;
						const receivedChatTitle = contentObject.chatTitle;
						const receivedContent = contentObject.message;

						console.log("responsedata", responseData.messages);

						setReceivedIsRecipeList(isRecipeList);

						if (isRecipeList) {
							// Set recipePanelData to the list of recipes
							setRecipePanelData({ recipes: contentObject.recipes });
							console.log("recipePanel", recipePanelData);
						}

						// Add the AI message to chatHistory
						const newAIMessage = {
							role: "assistant",
							content: receivedContent,
						};
						console.log("ai", newAIMessage);

						setChatHistory((prevChatHistory) => [
							...prevChatHistory,
							newAIMessage,
						]);

						scrollToBottom();
					}
				} catch (error) {
					console.error("Error fetching AI response:", error);
				}
			} catch (error) {
				console.error("Error", error.message);
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
						content: "I want to hear more about " + recipeName,
					};

					const updatedChatHistory = [...chatHistory, newUserMessage];

					setChatHistory(updatedChatHistory);

					fetchAIResponse({
						chatHistory: updatedChatHistory,
						userMessage: newUserMessage,
					});

					// Update selectedRecipe state
					setSelectedRecipe(recipePanelData.recipes[index]);
					console.log("selected", recipePanelData.recipes[index]);
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
			chatID: curChatId,
		});
	};

	return (
		<Container fluid className="py-5" style={{ backgroundColor: "#eee" }}>
			<Row className="justify-content-center">
				<Col md="4" lg="3" xl="2">
					<RecipePanel recipe={selectedRecipe} />
				</Col>
				<Col md="8" lg="9" xl="10">
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
							{showConversationStarters && (
								<ConversationStarters
									onStartConversation={handleStartConversation}
								/>
							)}
							{chatHistory

								.filter(
									(message) =>
										message && message.role && message.role !== "system"
								)

								.map((message, index) => (
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
							{receivedIsRecipeList && recipePanelData.recipes.length > 0 && (
								<RecipeCarousel
									recipes={recipePanelData.recipes}
									onRecipeClick={(index) => {
										const selectedRecipe = recipePanelData.recipes[index];
										setRecipePanelData({ recipes: [selectedRecipe] });
										handleRecipeSelection(selectedRecipe.title);
									}}
									selectedRecipe={selectedRecipe}
								/>
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
			</Row>
		</Container>
	);
}
