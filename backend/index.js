const express = require("express");
const cors = require("cors");

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
app.get("/user/:userId", (req, res) => {
	const userId = Number(req.params.userId);

	res.json({
		id: userId,
		name: "John",
		likes: ["bananas", "corn"],
		dislikes: ["apple", "orange"],
		allergies: {
			milk: "1",
			peanuts: "1",
			gluten: "2",
			beef: "2",
		},
		individual_chats: [0, 1],
		group_chats: [2, 3],
		recipe_book: [11, 22, 33],
	});
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
app.get("/recipe_book/:userId", (req, res) => {
	const userId = Number(req.params.userId);

	res.json({
		recipes: [
			{
				id: 11,
				name: "Banana Bread",
				chat_id: 111,
				text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
				picture_url: "https://placekitten.com/1000/1000",
				cuisine: "American",
			},
			{
				id: 22,
				name: "Cornbread",
				chat_id: 222,
				text: "## Cornbread Recipe\n\n**Ingredients:**\n- 1 cup (125g) all-purpose flour\n- 1 cup (150g) yellow cornmeal\n- 1/4 cup (50g) granulated sugar\n- 1 teaspoon salt\n- 1 tablespoon baking powder\n- 1 cup (240ml) milk\n- 1/3 cup (80ml) vegetable oil\n- 2 large eggs\n\n**Instructions:**\n1. Preheat your oven to 400°F (200°C). Grease a 9x9-inch baking dish.\n2. In a mixing bowl, whisk together the flour, cornmeal, sugar, salt, and baking powder.\n3. In a separate bowl, whisk together the milk, oil, and eggs.\n4. Add the wet ingredients to the dry ingredients and stir until just combined. Do not overmix.\n5. Pour the batter into the prepared baking dish.\n6. Bake in the preheated oven for 20 to 25 minutes, or until a toothpick inserted into the center comes out clean.\n7. Remove the cornbread from the oven and let it cool for 10 minutes before slicing.",
				picture_url: "https://placekitten.com/1000/1000",
				cuisine: "American",
			},
			{
				id: 33,
				name: "Empanadas",
				chat_id: 333,
				text: "## Empanadas Recipe\n\n**Ingredients:**\n- 1 recipe pastry for a 9-inch double-crust pie\n- 1/2 cup (100g) unsalted butter\n- 3 tablespoons all-purpose flour\n- 1/4 cup (60ml) water\n- 1/2 cup (100g) white sugar\n- 1/2 cup (100g) packed brown sugar\n- 8 Granny Smith apples - peeled, cored, and sliced\n\n**Instructions:**\n1. Preheat your oven to 425°F (220°C). Place the bottom crust in your pan.\n2. Melt the butter in a saucepan. Stir in flour to form a paste. Add water, white sugar, and brown sugar, and bring to a boil. Reduce temperature and let simmer.\n3. Place the apples in the prepared crust. Pour the sugar and butter mixture over the apples. Place the second crust on top of the apples.\n4. Bake in the preheated oven for 15 minutes. Reduce the temperature to 350°F (175°C) and continue baking for 35 to 45 minutes, until apples are soft.",
				picture_url: "https://placekitten.com/1000/1000",
				cuisine: "Argentine",
			},
		],
	});
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
		created_at: "2021-04-20T12:00:00Z",
	});
});

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
