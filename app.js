"use strict";

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

// Enable JSON request body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();
// cors setup for express API
const CLIENT_URL = process.env.CLIENT_URL;
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

// Root route to test the API server.
app.get('/', (req, res) => {
  res.json({ "greeting": "Hello world!" });
});

// Use book and user routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);

// Configure the port for the server
const port = process.env.PORT || 4000;

// Start the Express server

//TODO: UNCOMMENT THE CODE BELOW TO RUN LOCALLY
// app.listen(port, () => {
//   console.log(`API server listening on port ${port}`);
// });

module.exports.handler = serverless(app);