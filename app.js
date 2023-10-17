"use strict"

const express = require('express');
const app = express();
const cors = require("cors");

const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

app.use(express.json());

app.get('/', (req, res) => {
  // res.send("hello world!")
  res.json({ "greeting": "Hello world!" });
});

app.use("/books", bookRoutes);
app.use("/users", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});