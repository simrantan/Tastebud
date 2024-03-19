import express, { json } from "express";
import cors from "cors";
import {
	doc,
	addDoc,
	getDoc,
	collection,
	getDocs,
	updateDoc,
	setDoc,
	deleteDoc,
} from "firebase/firestore";
import { DATABASE } from "./firebase.js";
import {
	generateDummyData,
	getTimestamp,
} from "./generate_firebase_dummydata.js";
import systemMessage from './system_message.json' assert { type: 'json' };

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

// Middleware to parse JSON request body
app.use(express.json());

/* ########################### User ########################## */
/** Create a new user */
app.post("/user", async (req, res) => {
	// Test with: curl -X POST -H "Content-Type: application/json" -d '{"userId": "test"}' http://localhost:3001/user
	const userId = req.body.userId;
	const email = req.body.email;

	try {
		const userRef = collection(DATABASE, "users");
		await setDoc(doc(userRef, userId), {
			id: userId,
			email: email,
		});
		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

/** Get information for a single user */
app.get("/user/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		const docRef = doc(DATABASE, "users", userId);
		const docSnap = await getDoc(docRef);
		const recipesSnapshot = await getDocs(collection(docRef, "recipes"));
		const chatsSnapshot = await getDocs(collection(docRef, "chats"));

		if (docSnap.exists()) {
			let user = docSnap.data();
			user.recipes = [];
			user.chats = [];

			recipesSnapshot.forEach((doc) => {
				user.recipes.push({ ...doc.data(), id: doc.id });
			});
			chatsSnapshot.forEach((doc) => {
				user.chats.push({ ...doc.data(), id: doc.id });
			});

			res.json(user);
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
			data.push({ ...doc.data(), id: doc.id });
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

/** Add a recipe to a user's recipe book */
app.post("/recipe_book/:userId/add", async (req, res) => {
    const userId = req.params.userId;
    const recipeInfo = req.body;

	if (action === "add") {
		// Test with: curl -X POST -H "Content-Type: application/json" -d '{"action": "add", "recipeInfo": {"name": "Banana Bread", "chat_id": "RECIPE_ID", "text": "easy to make and delicious", "picture_url": "https://placekitten.com/1000/1000", "cuisine": "American"}}' http://localhost:3001/recipe_book/00000000_sample_user/111
		try {
			const recipeRef = collection(DATABASE, `users/${userId}/recipes`);
			await setDoc(doc(recipeRef, recipeId), recipeInfo);
			res.status(200).json({ success: true });
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal Server Error");
		}
	} else if (action === "remove") {
		// Test with: curl -X POST -H "Content-Type: application/json" -d '{"action": "remove", "recipeInfo": {"name": "Banana Bread", "chat_id": "RECIPE_ID", "text": "easy to make and delicious", "picture_url": "https://placekitten.com/1000/1000", "cuisine": "American"}}' http://localhost:3001/recipe_book/00000000_sample_user/111
		try {
			const recipeRef = collection(DATABASE, `users/${userId}/recipes`);
			await deleteDoc(doc(recipeRef, recipeId));
			res.status(200).json({ success: true });
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal Server Error");
		}
	} else {
		return res
			.status(400)
			.json({ error: "Invalid action (not 'add' or 'remove')" });
	}
});

/* ###################################################### Chat Methods ##################################################### */
/** Get response message from TasteBud after receiving user message */
app.post("/chat/:userID/message", async (req, res) => {
	// Test with: curl -X POST -H "Content-Type: application/json" -d '{"message": "I want to make a cake", "chatID": null}' http://localhost:3001/chat/00000000_sample_user/message
	
	const userId = req.params.userID;
	const isNewChat = req.body.chatID === null;
	const preferences = req.body.preferences;
	var input = req.body.message;
	var chatID = req.body.chatID;
	var chatRef = null;
	var messages = null;

	if (isNewChat) {
		// If new chat, create new chat in Firebase
		const chatsRef = collection(DATABASE, `users/${userId}/chats`);
		chatRef = await addDoc(chatsRef, {
			name: "New Chat",
			is_group: false,
			host_id: userId,
			created_at: getTimestamp(),
		});
		chatID = chatRef.id;
		// Start new message history in Firebase, starting with the system message
		await setDoc(
			doc(DATABASE, "users", userId, "chats", chatID, "messages", getTimestamp()),
			systemMessage
		);
		messages = [systemMessage];
	} else {
		// If chat already exists, get the chat reference and messages history from Firebase
		chatRef = doc(DATABASE, "users", userId, "chats", chatID);
		messages = req.body.messages;
	}

	const originalMessage = {
		role: "user",
		content: input
	}

	// Save the user's original message to Firebase
	setDoc(
		doc(DATABASE, "users", userId, "chats", chatID, "messages", getTimestamp()), originalMessage
	);

	// Append user's original message to messages history
	messages.push(originalMessage);

	input = "User input: \"" + input;

	// Append to user's input as appropriate
	if (preferences.likes && preferences.likes.length > 0) {
		input += ". It's not necessary to include these, but note that I like " + preferences.likes.join(", ") + ".";
	}
	if (preferences.dislikes && preferences.dislikes.length > 0) {
		input += ". I dislike " + preferences.dislikes.join(", ") + ", so exclude them.";
	}
	if (preferences.allergies && Object.keys(preferences.allergies).length > 0) {
		input += ". I am allergic to " + Object.keys(preferences.allergies).join(", ") + ", so DO NOT INCLUDE THEM IN ANY RECIPES YOU PROVIDE.";
	}

	if (isNewChat) {
		input += ". Generate a title for this chat in the 'chatTitle' field in your response."
	}

	input += "\"";

	input += "\nREMEMBER THIS SYSTEM MESSAGE!!!!!: " + systemMessage.content;

	const engineeredMessage = {
		role: "user",
		content: input,
	}

	// Add reformatted user message to messages that get sent to the API
	// messagesForAI.push(engineeredMessage);
	const messagesForAI = messages.slice(0, -1).concat(engineeredMessage);

	// Fetch API response
	var response = await getResponseFromAPI(messagesForAI);
	
	// Check if API response is properly formatted
	var check = await checkAPIResponseFormat(response.content, isNewChat);

	if (check === "OK") {
		// Trim response to everything within curly braces {}
		response.content = response.content.match(/\{[^]*\}/)[0];

		// Save API response to Firebase
		setDoc(
			doc(DATABASE, "users", userId, "chats", chatID, "messages", getTimestamp()),
			response
		);

		// Append response to messages history variable
		messages.push(response);

		const jsonResponse = JSON.parse(response.content);

		if (isNewChat) {
			updateDoc(chatRef, {name: jsonResponse.chatTitle});
		}

		res.json({
			chat_id: chatID,
			chatTitle: jsonResponse.chatTitle,
			isRecipeList: jsonResponse.isRecipeList,
			isRecipe: jsonResponse.isRecipe,
			message: jsonResponse.message,
			recipeTitles: jsonResponse.recipeTitles,
			recipe: jsonResponse.recipe,
			messages: messages,
		});
	} else {
		console.log("Retrying API call...");

		// If API's response is improperly formatted, try once more with correcting messages
		const messagesCopy = messages.concat(response, {
			role: "user",
			content: check + "\n REMEMBER THIS!!!!!: " + systemMessage.content
		});

		response = await getResponseFromAPI(messagesCopy);
		check = await checkAPIResponseFormat(response.content, isNewChat);

		if (check === "OK") {
			// Trim response to everything within curly braces {}
			response.content = response.content.match(/\{[^]*\}/)[0];

			// Save API response to Firebase
			setDoc(
				doc(DATABASE, "users", userId, "chats", chatID, "messages", getTimestamp()),
				response
			);
			
			// Append response to messages history variable
			messages.push(response);

			const jsonResponse = JSON.parse(response.content);

			if (isNewChat) {
				updateDoc(chatRef, {name: jsonResponse.chatTitle});
			}

			res.json({
				chat_id: chatID,
				chatTitle: jsonResponse.chatTitle,
				isRecipeList: jsonResponse.isRecipeList,
				isRecipe: jsonResponse.isRecipe,
				message: jsonResponse.message,
				recipeTitles: jsonResponse.recipeTitles,
				recipe: jsonResponse.recipe,
				messages: messages,
			});
		} else {
			// Give up
			res.status(500).send("Error: Could not properly fetch API response");
		}
	}
});

async function getResponseFromAPI(messages) {
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

	const response = await fetch(url, options);
	const result = await response.text();
	return JSON.parse(result).choices[0].message;
}

async function checkAPIResponseFormat(responseContent, isNewChat) {
	// Trim response to everything within curly braces {}
	const match = responseContent.match(/\{[^]*\}/);
	if (match !== null) {
		responseContent = match[0];
	} else {
		return "The response you sent does not contain a JSON object. Send me a JSON object!";
	}

	var jsonResponse = null;
	try {
		jsonResponse = JSON.parse(responseContent);
	} catch (error) {
		return "The response you sent is not properly formatted. It should be one singular JSON object. Fix it now!";
	}

	if (isNewChat && !("chatTitle" in jsonResponse)) {
		return "The field chatTitle was not included in your response. Include it and set it properly!";
	}

	if (!("isRecipeList" in jsonResponse)) {
		return "The field isRecipeList was not included in your response. Include it and set it properly!";
	} else if (jsonResponse.isRecipeList && !Array.isArray(jsonResponse.recipeTitles)) {
		return "You included the field isRecipeList but the field recipeTitles is not a proper string array of recipes. Include it and set it properly!";
	}

	if (!("isRecipe" in jsonResponse)) {
		return "The field isRecipe was not included in your response. Include it and set it properly!";
	} else if (jsonResponse.isRecipe && !("recipe" in jsonResponse)) {
		return "You included the field isRecipe but you failed to include a recipe. Include the field recipe and set it properly! Remember that a recipe contains title, cuisine, ingredients, and directions.";
	} else if (jsonResponse.isRecipe && (!("title" in jsonResponse.recipe) || !("cuisine" in jsonResponse.recipe) || !("ingredients" in jsonResponse.recipe) || !("directions" in jsonResponse.recipe))) {
		return "Remember that a recipe must contain title, cuisine, ingredients, and directions. You are missing something, fix it now!";
	} else if (jsonResponse.isRecipe && typeof jsonResponse.recipe.directions[0] === 'string' && jsonResponse.recipe.directions[0].substring(0, 2) !== "1.") {
		return "Your directions must be a string array, and the first step must start with '1.'. Fix it now!";
	}

	if (!("message" in jsonResponse)) {
		return "The field chatTitle was not included in your response. Include it and set it properly!";
	}

	return "OK";
}

/* ########################### Chat ########################## */
/** Get all the information for a single chat */
app.get("/chat/:userID/:chatID", async (req, res) => {
	const userId = req.params.userID;
	const chatID = req.params.chatID;

	try {
		const chatRef = doc(DATABASE, "users", userId, "chats", chatID);
		const docSnap = await getDoc(chatRef);
		const querySnapshot = await getDocs(collection(chatRef, "messages"));

		let chats = [];

		for (const doc of querySnapshot.docs) {
			chats.push(doc.data());
		}

		res.json({
			chats: chats,
			fields: docSnap.data(),
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

/** Set the metadata for a chat */
app.post("/chat/:userID/:chatID", async (req, res) => {
	// Test with curl -X POST -H "Content-Type: application/json" -d '{"name": "Example Chat"}' http://localhost:3001/chat/00000000_sample_user/new_chat
	const userId = req.params.userID;
	const chatID = req.params.chatID;
	const { name } = req.body;

	try {
		const chatRef = doc(DATABASE, "users", userId, "chats", chatID);
		await setDoc(chatRef, {
			name: name,
			is_group: false,
			host_id: userId,
			created_at: getTimestamp(),
		});
		res.status(200).json({ success: true });
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

app.get("/", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
