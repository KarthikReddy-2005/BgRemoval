import "dotenv/config";
import express from "express";
import cors from "cors";

import connectMongoDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoute.js";

const PORT = process.env.PORT || 4000;
const app = express();
await connectMongoDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is Live");
});
app.use("/api/user", userRouter);

app.listen(PORT, async () => {
  console.log("Server is running at : http://localhost:" + PORT);
});

export default app;
