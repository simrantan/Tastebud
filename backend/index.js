import express from "express";
import cors from "cors";
import {
	doc,
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
const maxTokens = 20; // Keeping this low for now to not use up $$$

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

/** Add or Remove a recipe from a user's recipe book */
app.post("/recipe_book/:userId/:recipeId", async (req, res) => {
	const userId = req.params.userId;
	const recipeId = req.params.recipeId;
	const { action, recipeInfo } = req.body;

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

/* ###################################################### Chat Methods ##################################################### */
/** Get response message from TasteBud after receiving user message */
app.post("/chat/:userID/:chatID/message", async (req, res) => {
	// Test with: curl -X POST -H "Content-Type: application/json" -d '{"message": "I want to make a cake"}' http://localhost:3001/chat/00000000_sample_user/00000000_sample_chat/message
	const userId = req.params.userID;
	const chatID = req.params.chatID;
	const input = req.body.message;

	const newMessage = {
		role: "user",
		content: input,
		created_at: new Date(),
	};

	// Get message history from request body, or default prompt
	const messages = req.body.messages || [
		{
			role: "system",
			content:
				"You are TasteBud! You help users find recipes based off of their dietary restrictions and preferences. Respond with 'Yes Chef!' to requests when appropriate.",
			created_at: getTimestamp(),
		},
	];

	// Save the user's message to Firebase
	setDoc(
		doc(DATABASE, "users", userId, "chats", chatID, "messages", getTimestamp()),
		newMessage
	);

	// Add user's message to array of all messages to send to the API
	messages.push(newMessage);

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
		let resMessage = JSON.parse(result).choices[0].message;

		resMessage.created_at = new Date();
		messages.push(resMessage);

		// Save TasteBud's response to Firebase
		setDoc(
			doc(
				DATABASE,
				"users",
				userId,
				"chats",
				chatID,
				"messages",
				getTimestamp()
			),
			resMessage
		);

		res.json({
			chat_id: chatID,
			response: resMessage.content,
			messages: messages,
		});
	} catch (error) {
		res.status(500).json({ error: "API Internal server error" });
	}

	// TODO: Think about how to organize recipe data with chat
});

app.get("/", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
