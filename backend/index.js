import express from "express";
import cors from "cors";
import { generateDummyData } from "./generate_firebase_dummydata.js";
import {
	doc,
	getDoc,
	collection,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { DATABASE } from "./firebase.js";
import express from "express";
import cors from "cors";
import { generateDummyData } from "./generate_firebase_dummydata.js";
import {
	doc,
	getDoc,
	collection,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { DATABASE } from "./firebase.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Information to access the Together API
const url = "https://api.together.xyz/v1/chat/completions";
const apiKey =
	"6bfe8f020ba958040d37edc7ef8ee9f35c72d8fee380f2850f50a8ecf97d09b4";
const headers = new Headers({
	"Content-Type": "application/json",
	Authorization: `Bearer ${apiKey}`,
});
const model = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const maxTokens = 2000; // Keeping this low for now to not use up $$$

// Use CORS middleware
app.use(
	cors({
		origin: "http://localhost:3000", // Allow requests only from this origin
	})
);

// Middleware to log request method and URL (for dev purposes)
app.use((req, res, next) => {
	// console.log(`HTTP Method: ${req.method}`);
	// console.log(`URL: ${req.url}`);
	next();
});

// Middleware to parse JSON request body
app.use(express.json());

/* ########################### User ########################## */
/** Get information for a single user */
app.get("/user/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		const docRef = doc(DATABASE, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			res.json(docSnap.data());
		} else {
			console.log("no user exists in Firebase with that ID");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

/** Save user preferences */
app.post("/user/:userId/preferences", async (req, res) => {
	const userId = req.params.userId;
	const prefType = req.body.prefType;

	try {
		const userRef = doc(DATABASE, "users", userId);

		// Test with: curl -X POST -H "Content-Type: application/json" -d '{"prefType": "likes", "preferences": ["cheese", "strawberries"]}' http://localhost:3001/user/00000000_sample_user/preferences
		if (prefType === "likes") {
			await updateDoc(userRef, {
				likes: req.body.preferences,
			});
			// Test with: curl -X POST -H "Content-Type: application/json" -d '{"prefType": "dislikes", "preferences": ["cheese", "strawberries"]}' http://localhost:3001/user/00000000_sample_user/preferences
		} else if (prefType === "dislikes") {
			await updateDoc(userRef, {
				dislikes: req.body.preferences,
			});
			// Test with: curl -X POST -H "Content-Type: application/json" -d '{"prefType": "allergies", "preferences": {"milk": 1, "peanuts": 2}}' http://localhost:3001/user/00000000_sample_user/preferences
		} else if (prefType === "allergies") {
			await updateDoc(userRef, {
				allergies: req.body.preferences,
			});
		} else {
			return res.status(400).json({ error: "Invalid prefType" });
		}
		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

/** Get the recipes in a user's recipe book */
app.get("/recipe_book/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		const querySnapshot = await getDocs(
			collection(DATABASE, "users", userId, "recipes")
		);

		let data = [];
		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});

		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

/* ########################### Recipe ########################## */
/** Get information for a single recipe */
app.get("/user/:userId/recipe/:recipeId", async (req, res) => {
	const userId = req.params.userId;
	const recipeId = req.params.recipeId;

	try {
		const docRef = doc(DATABASE, "users", userId, "recipes", recipeId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			res.json(docSnap.data());
		} else {
			console.log("can't find recipe");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

// TODO: add the firebase stuff into this
/** Add or Remove a recipe from a user's recipe book */
app.post("/recipe_book/:userId/:recipeId", (req, res) => {
	const userId = Number(req.params.userId);
	const recipeId = Number(req.params.recipeId);
	const { action, recipeInfo } = req.body;

	if (action == "add") {
		console.log(
			`Recipe with ID ${recipeId} added to the recipe book for user ${userId}`
		);
		const { name, chat_id, text, picture_url, cuisine } = recipeInfo;
		console.log("Additional recipe information:");
		console.log(`Name: ${name}`);
		console.log(`Chat ID: ${chat_id}`);
		console.log(`Text: ${text}`);
		console.log(`Picture URL: ${picture_url}`);
		console.log(`Cuisine: ${cuisine}`);
		// TODO: update firebase with new recipe
	} else if (action == "remove") {
		console.log(
			`Recipe with ID ${recipeId} removed from the recipe book for user ${userId}`
		);
		// TODO: remove recipe from firebase
	} else {
		return res
			.status(400)
			.json({ error: "Invalid action (not 'add' or 'remove')" });
	}
	res.status(200).json({ success: true });
});

/** Add or Remove a recipe from a user's recipe book */
app.post("/recipe_book/:userId/:recipeId", (req, res) => {
	const userId = Number(req.params.userId);
	const recipeId =  Number(req.params.recipeId);
	const {action, recipeInfo} = req.body;

	if (action == "add") {
		console.log(`Recipe with ID ${recipeId} added to the recipe book for user ${userId}`);
		const { name, chat_id, text, picture_url, cuisine } = recipeInfo;
		console.log("Additional recipe information:");
		console.log(`Name: ${name}`);
		console.log(`Chat ID: ${chat_id}`);
		console.log(`Text: ${text}`);
		console.log(`Picture URL: ${picture_url}`);
		console.log(`Cuisine: ${cuisine}`);
		// TODO: update firebase with new recipe
	}
	else if (action == "remove") {
		console.log(`Recipe with ID ${recipeId} removed from the recipe book for user ${userId}`);
		// TODO: remove recipe from firebase
	}
	else {
		return res.status(400).json({ error: "Invalid action (not 'add' or 'remove')" });
	}
	res.status(200).json({ success: true });
});


/* ########################### Chat ########################## */
// TODO: should return info about the chat, including the messages
/** Get all the information for a single chat */
app.get("/chat/:userID/:chatID", async (req, res) => {
	const userId = req.params.userID;
	const chatID = req.params.chatID;

	try {
		const querySnapshot = await getDocs(
			collection(DATABASE, "users", userId, "chats", chatID, "messages")
		);

		let chats = [];

		for (const doc of querySnapshot.docs) {
			chats.push(doc.data());
		}

		res.json(chats);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

/* ########################### Firebase Testing ########################## */
app.get("/firebase/dummy_data", (req, res) => {
	console.log("Creating dummy data...");
	generateDummyData();
	res.json({ message: "Dummy data created!" });
});

/* ###################################################### Chat Methods ##################################################### */
/** Get response message from TasteBud after receiving user message */
app.post("/chat/:chatID", async (req, res) => {
	const chatID = Number(req.params.chatID);
	const messages = req.body.messages;
	const input = req.body.message;
	// TO-DO: Add user input to Firebase

	const data = {
		model: model,
		max_tokens: maxTokens,
		messages: messages,
	};

	const options = {
		method: "POST",
		headers: headers,
		body: JSON.stringify(data),
	};

	try {
        const response = await fetch(url, options);
        const result = await response.text();
		const resMessage = JSON.parse(result).choices[0].message
		// TO-DO: Add AI response to Firebase

        res.json({
			chat_id: chatID,
			response: resMessage
        });
    } catch (error) {
        res.status(500).json({ error: 'API Internal server error' });
    }

	// TODO: Think about how to organize recipe data with chat
});

app.get("/", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
