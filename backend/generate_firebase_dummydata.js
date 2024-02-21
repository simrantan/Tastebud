import { initializeApp } from "firebase/app";
import { collection, doc, setDoc } from "firebase/firestore";
import { DATABASE } from "./firebase.js";

/* ########################### Constants ########################## */
const userRef = collection(DATABASE, "users");
const JOHN_ID = "00000000_sample_user";
const RECIPE_ID = "sample_recipe";
const CHAT_ID = "sample_chat";
/* ############################################################# */

export async function generateDummyData() {
	// Create a sample user
	await setDoc(doc(userRef, JOHN_ID), {
		id: JOHN_ID,
		name: "John",
		likes: ["bananas", "corn"],
		dislikes: ["apple", "orange"],
		allergies: {
			milk: "death",
			peanuts: "taste_bad",
			gluten: "illness",
			beef: "choice",
		},
		individual_chats: [CHAT_ID],
		group_chats: [],
		recipe_book: [RECIPE_ID],
	});

	// Create a reference to the "recipes" subcollection directly from the root of the database
	const johnRecipesRef = collection(DATABASE, `users/${JOHN_ID}/recipes`);

	// Create a sample recipe
	await setDoc(doc(johnRecipesRef), {
		name: "Banana Bread",
		chat_id: RECIPE_ID,
		text: "## Banana Bread Recipe\n\n**Ingredients:**\n- 2 to 3 ripe bananas, mashed\n- 1/3 cup (75g) melted butter\n- 1 teaspoon baking soda\n- Pinch of salt\n- 3/4 cup (150g) sugar\n- 1 large egg, beaten\n- 1 teaspoon vanilla extract\n- 1 1/2 cups (190g) all-purpose flour\n\n**Optional Add-ins:**\n- 1/2 cup (50g) chopped nuts (walnuts or pecans)\n- 1/2 cup (80g) chocolate chips\n\n**Instructions:**\n1. Preheat your oven to 350°F (175°C). Grease a 9x5-inch loaf pan.\n2. In a mixing bowl, mash the ripe bananas with a fork until smooth.\n3. Stir the melted butter into the mashed bananas.\n4. Mix in the baking soda and salt.\n5. Stir in the sugar, beaten egg, and vanilla extract.\n6. Mix in the flour until just combined. Do not overmix.\n7. If using, fold in the chopped nuts or chocolate chips.\n8. Pour the batter into the prepared loaf pan.\n9. Bake in the preheated oven for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean.\n10. Remove the banana bread from the oven and let it cool in the pan for 10 minutes.\n11. Transfer the bread to a wire rack to cool completely before slicing.",
		picture_url: "https://placekitten.com/1000/1000",
		cuisine: "American",
	});

	const johnChatsRef = collection(DATABASE, `users/${JOHN_ID}/chats`);

	// Create a sample chat
	await setDoc(doc(johnChatsRef, CHAT_ID), {
		id: CHAT_ID,
		name: "Post-Show Treat",
		is_group: false,
		host_id: JOHN_ID,
		recipes: [RECIPE_ID],
		guests: [],
		created_at: new Date(),
		messages: [{}],
	});
}
