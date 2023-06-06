// const express = require("express");
const { getActualMatch } = require("./starbet.js");

// const app = express();
// app.use(express.json());
// const port = 3000;

// app.get("/:team", async (req, res) => {
//     const response = await getActualMatch(req.params.team);
//     res.send({ response });
// });

// app.listen(port, () => console.log(`Server running on port ${port}!`));

getActualMatch("Cruzeiro");