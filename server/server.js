import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";

// connectDB();

// dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup");
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on Port ${PORT}`
  );
});
