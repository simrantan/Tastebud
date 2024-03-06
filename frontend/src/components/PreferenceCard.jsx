import React, { useState, useEffect } from "react";
import {
	Form,
	Col,
	Button,
	FormControl,
	Dropdown,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import "./PreferenceCard.css";

const PreferenceCard = () => {
	//state
	const [allergens, setAllergens] = useState({});
	const [likes, setLikes] = useState([]);
	const [dislikes, setDislikes] = useState([]);
	const [newAllergen, setNewAllergen] = useState("");
	const [newLike, setNewLike] = useState("");
	const [newDislike, setNewDislike] = useState("");
	const userId = "00000000_sample_user";

	useEffect(() => {
		const fetchPreferences = async () => {
			try {
				const response = await fetch(`http://localhost:3001/user/${userId}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				// Update state with fetched preferences
				setAllergens(data.allergies || {});
				setLikes(data.likes || []);
				setDislikes(data.dislikes || []);
				console.log("set user data");
			} catch (error) {
				console.error("Error fetching preferences:", error.message);
			}
		};

		// Fetch user preferences on the first run
		fetchPreferences();
	}, []); // Empty dependency array ensures it runs only once

	useEffect(() => {
		const savePreferences = async (prefType, preferences) => {
			try {
				const response = await fetch(
					`http://localhost:3001/user/${userId}/preferences`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ prefType, preferences }),
					}
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
			} catch (error) {
				console.error("Error saving preferences:", error.message);
			}
		};

		// Check for allergens, likes, and dislikes and make API calls
		if (Object.keys(allergens).length >= 0) {
			console.log("Sending allergens data to the backend:", allergens);
			savePreferences("allergies", allergens);
		}
		if (likes.length >= 0) {
			console.log("Sending likes data to the backend:", likes);
			savePreferences("likes", likes);
		}
		if (dislikes.length >= 0) {
			console.log("Sending dislikes data to the backend:", dislikes);
			savePreferences("dislikes", dislikes);
		}
	}, [allergens, likes, dislikes]); //pending:  add functionality for only sending data when there is a change

	const handleAddAllergen = (e) => {
		e.preventDefault();
		if (newAllergen.trim() !== "") {
			setAllergens({ ...allergens, [newAllergen]: 1 });
			setNewAllergen("");
		}
	};

	const handleRemoveAllergen = (allergen) => {
		const updatedAllergens = { ...allergens };
		delete updatedAllergens[allergen];
		setAllergens(updatedAllergens);
	};

	const handleCategoryChange = (allergen, category) => {
		setAllergens({ ...allergens, [allergen]: category });
	};

	const handleAddLike = (e) => {
		e.preventDefault();
		if (newLike.trim() !== "") {
			setLikes([...likes, newLike]);
			setNewLike("");
			console.log(likes);
		}
	};

	const handleRemoveLike = (like) => {
		const updatedLikes = likes.filter((item) => item !== like);
		setLikes(updatedLikes);
	};

	const handleAddDislike = (e) => {
		e.preventDefault();
		if (newDislike.trim() !== "") {
			setDislikes([...dislikes, newDislike]);
			setNewDislike("");
		}
	};

	const handleRemoveDislike = (dislike) => {
		const updatedDislikes = dislikes.filter((item) => item !== dislike);
		setDislikes(updatedDislikes);
	};

	return (
		<div className="preference-card-container">
			{/* Allergens Section */}
			<h1 className="section-title">Allergens</h1>
			<Form>
				<Form.Group controlId="newAllergen">
					<FormControl
						type="text"
						placeholder="Type allergen and press Enter"
						value={newAllergen}
						onChange={(e) => setNewAllergen(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddAllergen(e)}
					/>
				</Form.Group>
			</Form>
			<div className="preference-container">
				{Object.entries(allergens).map(([allergen, category]) => (
					<span key={allergen} className="item">
						<span className="item-text">{allergen}</span>
						<span className="ml-2">
							{" "}
							{category === 1 ? "💀" : category === 2 ? "🤢" : "💀"}
						</span>
						<span>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip place="top" effect="solid">
										<div>💀 This will kill me</div>
										<div>🤢 This makes me ill</div>
									</Tooltip>
								}
							>
								<span className="ml-2" style={{ cursor: "pointer" }}>
									?
								</span>
							</OverlayTrigger>
						</span>
						<Dropdown className="ml-2">
							<Dropdown.Toggle
								variant="secondary"
								id="dropdown-basic"
								className="custom-dropdown-toggle"
							></Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item
									className="dropdown-text"
									onClick={() => handleCategoryChange(allergen, 1)}
								>
									💀
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item
									onClick={() => handleCategoryChange(allergen, 2)}
								>
									🤢
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Button
							variant="danger"
							size="sm"
							className="custom-remove-button"
							onClick={() => handleRemoveAllergen(allergen)}
						>
							X
						</Button>
					</span>
				))}
			</div>

			{/* Likes Section */}
			<hr />
			<h1 className="section-title">Likes</h1>

			<Form>
				<Form.Group controlId="newLike">
					<FormControl
						type="text"
						placeholder="Type like and press Enter"
						value={newLike}
						onChange={(e) => setNewLike(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddLike(e)}
					/>
				</Form.Group>
			</Form>
			<div className="preference-container">
				{Array.from(likes).map((like) => (
					<span key={like} className="item">
						<span className="item-text">{like}</span>
						<Button
							variant="danger"
							size="sm"
							className="ml-2"
							onClick={() => handleRemoveLike(like)}
						>
							X
						</Button>
					</span>
				))}
			</div>

			{/* Dislikes Section */}
			<hr />
			<h1 className="section-title">Dislikes</h1>
			<Form>
				<Form.Group controlId="newDislike">
					<FormControl
						type="text"
						placeholder="Type dislike and press Enter"
						value={newDislike}
						onChange={(e) => setNewDislike(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddDislike(e)}
					/>
				</Form.Group>
			</Form>
			<div className="preference-container">
				{Array.from(dislikes).map((dislike) => (
					<span key={dislike} className="item">
						<span className="item-text">{dislike}</span>
						<Button
							variant="danger"
							size="sm"
							className="ml-2"
							onClick={() => handleRemoveDislike(dislike)}
						>
							X
						</Button>
					</span>
				))}
			</div>
		</div>
	);
};

export default PreferenceCard;
