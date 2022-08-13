const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Meme service on port ${PORT}`);
});
