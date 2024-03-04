import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import RecipePanel from "./recipeSidebar";
import RecipeCarousel from "./RecipeCarousel";

const hardcodedUserId = 1; // Hardcoded userId
const API_CHAT_ENDPOINT = "http://localhost:3001/chat";
const AI_SIMULATION_ENDPOINT = `${API_CHAT_ENDPOINT}/${hardcodedUserId}`;

export default function ChatsMain() {
	const [userInput, setUserInput] = useState("");
	const [chatHistory, setChatHistory] = useState([{}]);
	const [canSendAiMessage, setCanSendAiMessage] = useState(true);
	const [recipePanelData, setRecipePanelData] = useState(null);
	const [isRecipeList, setIsRecipeList] = useState(false);

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleInputChange = (e) => {
		setUserInput(e.target.value);
	};

	const handleSendMessage = () => {
		if (userInput.trim() === "") return;

		const newUserMessage = {
			role: "user",
			content: userInput,
		};

		setChatHistory((prevChatHistory) => [...prevChatHistory, newUserMessage]);
		setUserInput("");
		setCanSendAiMessage(true);

		fetchAIResponse({
			chatHistory: [...chatHistory, newUserMessage],
			userMessage: newUserMessage,
		});
	};

	const fetchAIResponse = async (requestData) => {
		try {
			if (!canSendAiMessage) return;

			const response = await fetch(`${API_CHAT_ENDPOINT}/1`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					requestData,
				}),
			});

			const responseData = await response.json();

			handleBackendResponse(responseData);
		} catch (error) {
			console.error("Error sending/receiving messages:", error);
			console.error(error.message);
			console.error(error.stack);
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

	const handleRecipeSelection = async (recipeIndex) => {
		try {
			await fetch(`${API_CHAT_ENDPOINT}/select-recipe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					recipeIndex,
				}),
			});

			const updatedRecipePanelData = await fetchRecipePanelData();
			setRecipePanelData(updatedRecipePanelData);
		} catch (error) {
			console.error("Error selecting recipe:", error);
		}
	};

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
									onRecipeClick={handleRecipeSelection}
								/>
							) : (
								chatHistory.map((message, index) => (
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
								))
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
				<RecipePanel recipe={recipePanelData} />
			</Row>
		</Container>
	);
}
