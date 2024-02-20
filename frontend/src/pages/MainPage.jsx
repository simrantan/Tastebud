import React from "react";
import { Button } from "react-bootstrap";
import PreferenceCard from "../components/PreferenceCard.jsx";

export default function MainPage({ props }) {
	return (
		<div className="main-container">
			MainPage
			<Button>button</Button>
			<PreferenceCard />
		</div>
	);
}
