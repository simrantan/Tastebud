import React from "react";
import ReactDOM from "react-dom";
import { StrictMode } from "react";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap"; // Import necessary components from react-bootstrap

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<StrictMode>
		<Container>
			{" "}
			{/* Use Container from react-bootstrap */}
			<App />
		</Container>
	</StrictMode>
);
