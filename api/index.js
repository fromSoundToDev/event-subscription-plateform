import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";
import eventRoute from "./routes/event.route.js";

dotenv.config();
// connection with the db
const mongo = process.env.MONGO_URI;
mongoose
  .connect(mongo)
  .then(() => {
    console.log("connected successfully to the db");
  })
  .catch((Error) => {
    console.log(Error);
  });
//creating extanciating express server

const app = express();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
// middleware
app.use(express.json());
app.use((err, req, res, next) => {
  const statusCode = statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// calling routes

app.use("/api/v1/auth", authRouter);

const eventRoutes = require('./routes/event.routes');

// Utiliser les routes pour les événements
app.use('/api/events',eventRoute)
