import express from "express";
import { generateDummyData } from "./generate_firebase_dummydata.js";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
const maxTokens = 20; // Keeping this low for now to not use up $$$

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
app.post("/user/:userId/preferences", (req, res) => {
	const userId = Number(req.params.userId);
	const prefType = req.body.prefType;

	if (prefType === "likes") {
		console.log(`userId: ${userId} likes ${req.body.preferences}`);
		// TODO: update firebase with user likes
	} else if (prefType === "dislikes") {
		console.log(`userId: ${userId} dislikes ${req.body.preferences}`);
		// TODO: update firebase with user dislikes
	} else if (prefType === "allergies") {
		console.log(
			`userId: ${userId} allergies ${JSON.stringify(req.body.preferences)}`
		);
		// TODO: update firebase with user allergies
	} else {
		return res.status(400).json({ error: "Invalid prefType" });
	}
	res.status(200).json({ success: true });
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
app.get("/recipe/:recipeId", (req, res) => {
	const recipeId = Number(req.params.recipeId);

	res.json({
		id: recipeId,
		name: "Banana Bread",
		chat_id: 111,
		text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
		picture_url: "https://placekitten.com/1000/1000",
		cuisine: "American",
	});
});

/* ########################### Chat ########################## */
/** Get information for a single chat */
app.get("/chat/:chatID", (req, res) => {
	const chatID = Number(req.params.chatID);

	res.json({
		id: chatID,
		name: "Post-Show Treat",
		is_group: true,
		host_id: 0,
		recipes: [111, 222, 333],
		guests: [1, 2, 3],
		created_at: new Date(),
		messages: [{}],
	});
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
	// const messages = req.body.messages; // History of messages from front end state
	const input = req.body.message;

	const messages = [
		{
			role: "system",
			content:
				"You are TasteBud! You help users find recipes based off of their dietary restrictions and preferences. Respond with 'Yes Chef!' to requests when appropriate.",
		},
	];

	messages.push({ role: "user", content: input });

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
		const resMessage = JSON.parse(result).choices[0].message;
		const content = resMessage.content;
		messages.push(resMessage);

		res.json({
			chat_id: chatID,
			response: content,
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
