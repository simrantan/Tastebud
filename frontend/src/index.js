import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import { Container } from "react-bootstrap"; // Import necessary components from react-bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

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
