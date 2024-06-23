import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();

console.log(process.env.PORT);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup");
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on Port ${PORT}`
  );
});
