import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import RecipePanel from "./recipeSidebar";

const hardcodedUserId = 1; // Hardcoded userId
const API_CHAT_ENDPOINT = "http://localhost:3001/chat";
const AI_SIMULATION_ENDPOINT = `${API_CHAT_ENDPOINT}/${hardcodedUserId}`;

export default function ChatsMain() {
	const [userInput, setUserInput] = useState("");
	const [chatHistory, setChatHistory] = useState([{}]);
	const [canSendAiMessage, setCanSendAiMessage] = useState(true);
	const [recipePanelData, setRecipePanelData] = useState(null);

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

		// User message
		const newUserMessage = {
			role: "user",
			content: userInput,
		};

		setChatHistory((prevChatHistory) => [...prevChatHistory, newUserMessage]);
		setUserInput("");

		// Allow AI to send a message after user sends one
		setCanSendAiMessage(true);
	};

	useEffect(() => {
		const fetchAIResponse = async () => {
			try {
				if (!canSendAiMessage) return;

				const response = await fetch(`${API_CHAT_ENDPOINT}/1`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						messages: [...chatHistory, { role: "user", content: userInput }],
					}),
				});

				const responseData = await response.json();

				// Log the response data to check what's being received
				console.log("Backend Response Data:", responseData);

				// Assuming the backend handles AI integration
				const aiResponse = await simulateAIResponse(responseData.messages);

				// Log the AI response to check what's being received
				console.log("AI Response:", aiResponse);

				// Update UI with AI response
				const newAiMessage = {
					role: "assistant",
					content: aiResponse,
				};

				if (responseData.isRecipe) {
					setRecipePanelData(responseData.recipe);
				}

				setChatHistory((prevChatHistory) => [...prevChatHistory, newAiMessage]);

				// Set flag to prevent AI from sending until the next user message
				setCanSendAiMessage(false);
			} catch (error) {
				console.error("Error sending/receiving messages:", error);
				// Log more details about the error
				console.error(error.message);
				console.error(error.stack);
				// Handle error in UI if needed
			}
		};

		scrollToBottom();
		fetchAIResponse();
	}, [userInput, chatHistory, canSendAiMessage]);

	const simulateAIResponse = async (messages) => {
		try {
			const response = await fetch(AI_SIMULATION_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: messages,
				}),
			});

			const responseData = await response.json();

			// Log the AI simulation response to check what's being received
			console.log("AI Simulation Response:", responseData);

			return responseData.response; // Assuming the backend handles AI integration
		} catch (error) {
			console.error("Error fetching AI response:", error);
			return "AI response goes here";
		}
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
				<RecipePanel recipe={recipePanelData} />
			</Row>
		</Container>
	);
}
