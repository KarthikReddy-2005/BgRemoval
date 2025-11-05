import "dotenv/config";
import express from "express";
import cors from "cors";

import connectMongoDB from "./configs/mongodb.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is Live");
});

app.listen(PORT, async () => {
  await connectMongoDB();
  console.log("Server is running at : http://localhost:" + PORT);
});

export default app;
