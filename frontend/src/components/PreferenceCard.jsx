import React, { useState, useEffect } from "react";
import {
	Form,
	Button,
	FormControl,
	Dropdown,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import "./PreferenceCard.css";
import { useUser } from "../contexts/UserContext";

const PreferenceCard = () => {
	const { userData } = useUser();
	const [allergens, setAllergens] = useState({});
	const [likes, setLikes] = useState([]);
	const [dislikes, setDislikes] = useState([]);
	const [newAllergen, setNewAllergen] = useState("");
	const [newLike, setNewLike] = useState("");
	const [newDislike, setNewDislike] = useState("");
	const userId = userData.id;

	useEffect(() => {
		const fetchPreferences = async () => {
			try {
				const response = await fetch(`http://localhost:3001/user/${userId}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				// Update state with fetched preferences
				setAllergens(data.allergies !== undefined ? data.allergies : []);
				setLikes(data.likes !== undefined ? data.likes : []);
				setDislikes(data.dislikes !== undefined ? data.dislikes : []);
			} catch (error) {
				console.error("Error fetching preferences:", error.message);
			}
		};

		fetchPreferences();
	}, [userId]);

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

	const handleAddAllergen = (e) => {
		e.preventDefault();
		if (newAllergen.trim() !== "") {
			setAllergens((prevAllergens) => {
				const updatedAllergens = { ...prevAllergens, [newAllergen]: 1 };
				// Now, you can call savePreferences as a callback
				savePreferences("allergies", updatedAllergens);
				return updatedAllergens;
			});
			setNewAllergen("");
		}
	};

	const handleRemoveAllergen = (allergen) => {
		const updatedAllergens = { ...allergens };
		delete updatedAllergens[allergen];
		// Use the functional update form of setAllergens
		setAllergens((prevAllergens) => {
			// This callback will be executed after setAllergens is completed
			savePreferences("allergies", updatedAllergens);
			return updatedAllergens;
		});
	};

	const handleCategoryChange = (allergen, category) => {
		setAllergens((prevAllergens) => {
			const updatedAllergens = { ...prevAllergens, [allergen]: category };
			// Call savePreferences as a callback
			savePreferences("allergies", updatedAllergens);
			return updatedAllergens;
		});
	};
	const handleAddLike = (e) => {
		e.preventDefault();
		if (newLike.trim() !== "") {
			setLikes((prevLikes) => {
				const updatedLikes = [...prevLikes, newLike];
				// Call savePreferences as a callback
				savePreferences("likes", updatedLikes);
				return updatedLikes;
			});
			setNewLike("");
			console.log(likes);
		}
	};

	const handleRemoveLike = (like) => {
		setLikes((prevLikes) => {
			const updatedLikes = prevLikes.filter((item) => item !== like);
			// Call savePreferences as a callback
			savePreferences("likes", updatedLikes);
			return updatedLikes;
		});
	};

	const handleAddDislike = (e) => {
		e.preventDefault();
		if (newDislike.trim() !== "") {
			setDislikes((prevDislikes) => {
				const updatedDislikes = [...prevDislikes, newDislike];
				// Call savePreferences as a callback
				savePreferences("dislikes", updatedDislikes);
				return updatedDislikes;
			});
			setNewDislike("");
		}
	};

	const handleRemoveDislike = (dislike) => {
		setDislikes((prevDislikes) => {
			const updatedDislikes = prevDislikes.filter((item) => item !== dislike);
			// Call savePreferences as a callback
			savePreferences("dislikes", updatedDislikes);
			return updatedDislikes;
		});
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
								<span
									className="ml-2"
									style={{
										cursor: "pointer",
										display: "inline-block",
										width: "20px",
										height: "20px",
										borderRadius: "50%",
										backgroundColor: "grey",
										color: "#fff",
										textAlign: "center",
										lineHeight: "20px", // Vertical centering of the question mark
										fontSize: "14px", // Adjust the font size
										marginRight: "5px",
										marginLeft: "5px",
									}}
								>
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
