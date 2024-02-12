const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
