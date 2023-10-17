"use strict"

const express = require('express');
const app = express();
const cors = require("cors");

const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

// Enable JSON request body parsing
app.use(express.json());

/** Root route to test the API server. */
app.get('/', (req, res) => {
  res.json({ "greeting": "Hello world!" });
});

// Use book and user routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);

// Configure the port for the server
const port = process.env.PORT || 4000;

// Start the Express server
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});