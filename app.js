const express = require('express');
const app = express();
const cors = require("cors");

const bookRoutes = require("./routes/books")

app.get('/', (req,res) => {
  // res.send("hello world!")
  res.json({"greeting": "Hello world!"})
})

app.use("/books", bookRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});