import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAhAZONLZ75fA2aXOG5Qx50bhgoaA6UyUo", //TODO: make this secret
	authDomain: "tastebud-68924.firebaseapp.com",
	projectId: "tastebud-68924",
	storageBucket: "tastebud-68924.appspot.com",
	messagingSenderId: "708594287238",
	appId: "1:708594287238:web:d37ffdf34ebe8dc9fb4707",
	measurementId: "G-8WWTR34KTE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export default async function generateDummyData() {
	const userRef = db.collection("users");

	await userRef.doc().set({
		id: 0,
		name: "John",
		likes: ["bananas", "corn"],
		dislikes: ["apple", "orange"],
		allergies: {
			milk: "death",
			peanuts: "taste_bad",
			gluten: "illness",
			beef: "choice",
		},
		individual_chats: [0, 1],
		group_chats: [2, 3],
		recipe_book: [11, 22, 33],
	});
}
