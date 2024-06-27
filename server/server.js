import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mainRouter from './routes/index.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);

console.log(process.env.PORT);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup");
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on Port ${PORT}`
  );
});
