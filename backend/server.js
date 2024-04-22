import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDB.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
connectDb();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
