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
// const CLIENT_URL = process.env.CLIENT_URL;
const CLIENT_URL = 'http://localhost:3000';

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

// const allowedOrigins = ['https://pagepal.hannahnguyen.me'];

// Configure CORS with the allowed origin(s)
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// // Use the configured CORS middleware
// app.use(cors(corsOptions));

// app.use(cors());

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

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports.handler = serverless(app);