import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import RecipePanel from "./recipeSidebar";
import RecipeCarousel from "./carousel";
import ConversationStarters from "./conversationStarters";
import { useParams } from "react-router-dom";
import "./ChatStyle.css";
import { useUser } from "../contexts/UserContext";

export default function ChatsMain() {
	const { userData } = useUser();

	const { chatId } = useParams();
	console.log("chattt" + chatId);
	const [userInput, setUserInput] = useState("");
	const [chatHistory, setChatHistory] = useState([{}]);
	const [recipePanelData, setRecipePanelData] = useState({ recipes: [] });
	const [receivedIsRecipeList, setReceivedIsRecipeList] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [showConversationStarters, setShowConversationStarters] =
		useState(true);
	const [isQuerying, setIsQuerying] = useState(false);

	const [curChatId, setCurChatId] = useState(chatId);

	const messagesEndRef = useRef(null);
	const userId = userData.id;
	const AI_SIMULATION_ENDPOINT = `http://localhost:3001/chat/${userId}/message`;
	const get_chats = `http://localhost:3001/chat/${userId}`;

	useEffect(() => {
		// Set chat history with URL
		const fetchData = async () => {
			try {
				if (chatId === undefined) {
					// Start a new conversation with conversation starters and empty chat history
					setChatHistory([]);
					setShowConversationStarters(true); // Show conversation starters
					return; // Skip the rest of the logic for a new conversation
				}

				const response = await fetch(`${get_chats}/${chatId}`, {
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
				let lastAssistantMessage = null; // Track the last assistant message

				// Use a loop to iterate through messages
				for (const message of chatData.chats) {
					if (message.role === "user") {
						allMessages.push({
							role: message.role,
							content: message.content,
						});
					} else if (message.role === "assistant") {
						const assistantContent = JSON.parse(message.content);
						lastAssistantMessage = assistantContent;
						const addMessage = {
							role: "assistant",
							content: assistantContent.message,
						};
						allMessages.push(addMessage);
					}
				}

				if (allMessages.length >= 1) {
					setShowConversationStarters(false);
				}

				setChatHistory(allMessages);

				// Check if the last assistant message contains isRecipeList
				if (
					lastAssistantMessage &&
					JSON.parse(lastAssistantMessage.content).isRecipeList === true
				) {
					const isRecipeList = lastAssistantMessage.isRecipeList;

					if (isRecipeList) {
						// Set recipePanelData to the list of recipes
						setRecipePanelData({ recipes: contentObject.recipeTitles });
					}
				}

				setChatHistory(allMessages);
			} catch (error) {
				console.error("Error fetching chat data:", error);
			}
		};

		setCurChatId((prevChatId) => {
			const newChatId = chatId; /* your logic to determine the new chatId */

			console.log("curChatId: " + prevChatId);
			console.log("newChatId: " + newChatId);

			// Perform any additional logic or side effects here
			fetchData();

			return newChatId;
		});
	}, [chatId]);

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
				const response = await fetch(`http://localhost:3001/user/${userId}`);
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
					setIsQuerying(true);
					const response2 = await fetch(AI_SIMULATION_ENDPOINT, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: {
							message: userMessage.content, // Send only the content
							// Include other necessary data for the backend
							preferences: preferences,
							chatID: curChatId !== undefined ? curChatId : null,
							messages: chatHistory,
						},
					}).then((response) => {
						setIsQuerying(false);
						return response;
					});

					const responseData = await response2.json();

					if (curChatId == undefined) {
						setChatHistory(responseData.messages.slice(0, 2));
					}
					const newID = responseData.chat_id;
					setCurChatId(newID);
					console.log("newid", newID);

					const contentObject = responseData.content; // Assuming content is a string
					const isRecipeList = contentObject.isRecipeList;
					const isRecipe = contentObject.isRecipe;
					const receivedChatTitle = contentObject.chatTitle;
					const receivedContent = contentObject.message;

					console.log("responsedata", responseData.messages);

					setReceivedIsRecipeList(isRecipeList);

					if (isRecipeList) {
						// Set recipePanelData to the list of recipes
						setRecipePanelData({ recipes: contentObject.recipeTitles });
						console.log("recipePanel", recipePanelData);
					}
					if (isRecipe) {
						setSelectedRecipe(contentObject.recipe);
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
						content: "I picked  " + recipeName,
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
			chatID: curChatId,
		});
	};

	return (
		<Container
			className="p-4"
			style={{
				backgroundColor: "#FFF9F3",
				marginLeft: "200px",
				maxWidth: "calc(100% - 650px)",
				height: "86vh",
			}}
		>
			<Row className="justify-content-center" style={{ height: "100%" }}>
				<Col md="4" style={{ height: "100%" }}>
					<RecipePanel recipe={selectedRecipe} />
				</Col>

				<Col md="8" style={{ height: "100%" }}>
					<Card
						id="chat2"
						style={{
							borderRadius: "15px",
							border: "1px solid #ccc",
							overflow: "hidden",
							height: "100%",
							backgroundColor: "#FFF9F3",
						}}
					>
						<Card.Body style={{ overflowY: "auto" }}>
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
													message.role === "user" ? "user-message" : "bg-light"
												}`}
											>
												{message.content}
											</p>
										</div>
									</div>
								))}

							{receivedIsRecipeList(
								<RecipeCarousel
									recipes={recipePanelData.recipes}
									onRecipeClick={(index) => {
										const indexRecipe = recipePanelData.recipes[index];
										setRecipePanelData({ recipes: [indexRecipe] });
										handleRecipeSelection(indexRecipe.title);
									}}
								/>
							)}
							<div ref={messagesEndRef} />

							{isQuerying && (
								// Show typing indicator
								<img
									className="d-block mx-auto mt-3 mb-3"
									style={{ maxWidth: "100px" }}
									src="https://media.tenor.com/NqKNFHSmbssAAAAi/discord-loading-dots-discord-loading.gif"
									alt="waiting for response"
								/>
							)}
						</Card.Body>

						<Card.Footer className="text-muted d-flex justify-content-start align-items-center p-3">
							<Form.Control
								type="text"
								className="form-control-lg"
								id="exampleFormControlInput1"
								placeholder="Type message"
								disabled={isQuerying}
								value={userInput}
								onChange={handleInputChange}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleSendMessage();
									}
								}}
							/>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
