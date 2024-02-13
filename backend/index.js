const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to log request method and URL (for dev purposes)
app.use((req, res, next) => {
	console.log(`HTTP Method: ${req.method}`);
	console.log(`URL: ${req.url}`);
	next();
});

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
			milk: "death",
			peanuts: "taste_bad",
			gluten: "illness",
			beef: "choice",
		},
		chats: [0, 1, 2, 3],
		recipe_book: [11, 22, 33],
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
	});
});

/* ########################### Chat ########################## */
/** Get information for a single chat */
app.get("/chat/:chatID", (req, res) => {
	const chatID = Number(req.params.chatID);

	res.json({
		id: chatID,
		host_id: 0,
		recipes: [111, 222, 333],
		guests: [1, 2, 3],
		created_at: "2021-04-20T12:00:00Z",
	});
});

app.get("/", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
