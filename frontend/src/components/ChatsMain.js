import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

export default function ChatsMain() {
	const [userInput, setUserInput] = useState("");
	const [messages, setMessages] = useState([
		{
			role: "system",
			content: "You are an AI assistant",
		},
	]);

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleInputChange = (e) => {
		setUserInput(e.target.value);
	};

	const handleSendMessage = async () => {
		if (userInput.trim() === "") return;

		// User message
		const newUserMessage = {
			role: "user",
			content: userInput,
		};

		setMessages((prevMessages) => [...prevMessages, newUserMessage]);
		setUserInput("");

		// Simulate AI response (replace this with your actual AI integration)
		try {
			const aiResponse = await simulateAIResponse(userInput); // replace with actual AI logic
			const newAiMessage = {
				role: "assistant",
				content: aiResponse,
			};

			setMessages((prevMessages) => [...prevMessages, newAiMessage]);
		} catch (error) {
			console.error("Error fetching AI response:", error);
		}
	};

	const simulateAIResponse = async (userInput) => {
		// Simulated delay to mimic AI processing time
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Replace this with your actual AI integration logic
		return "AI response goes here";
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
							{messages.map((message, index) => (
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
			</Row>
		</Container>
	);
}
