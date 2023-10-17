"use strict";

const express = require("express");
const router = express.Router();
const axios = require('axios');
// const nthline = require('nthline')
const readline = require('readline');
const { PassThrough } = require('stream');

const gutendexRequest = async (endpoint, data = {}, method = "get") => {
  const url = `https://gutendex.com/${endpoint}`;
  const params = (method === "get")
    ? data
    : {};

  try {
    return (await axios({ url, method, data, params })).data;
  } catch (err) {
    console.error("API Error:", err.response);
    let message = err.response.data.error.message;
    throw Array.isArray(message) ? message : [message];
  }
};

router.get("/", async function (req, res, next) {
  const books = await gutendexRequest("books");
  return res.json({ books });
});

router.get("/:id", async function (req, res, next) {
  const book = await gutendexRequest(`books/${req.params.id}`);
  return res.json({ book });
});

router.get("/:id/text", async function (req, res, next) {
  const book = await gutendexRequest(`books/${req.params.id}`);
  const bookText = book.formats["text/plain; charset=us-ascii"];
  return res.json({ bookText });
});

router.get("/:id/text/:pageNumber", async function (req, res, next) {
  try {
    const book = await gutendexRequest(`books/${req.params.id}`);
    const pageNumber = parseInt(req.params.pageNumber);
    const lineStart = (pageNumber - 1) * 20;
    const bookText = book.formats["text/plain; charset=us-ascii"];

    const response = await axios.get(bookText, { responseType: 'stream' });
    const stream = new PassThrough();
    response.data.pipe(stream);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    let linesArray = [];

    rl.on("line", function (line) {
      lineCount++;

      if (lineCount >= lineStart + 1 && lineCount <= lineStart + 40) {
        linesArray.push(line);
      }

      if (lineCount === lineStart + 40) {
        rl.close();
      }
    });

    rl.on('close', function () {
      res.set('Content-Type', 'text/plain'); // Set the response content type
      const linesString = linesArray.join(' \n');
      let page = `page${pageNumber}`;
      // const jsonResponse = {
      //   [page]: linesString
      // }
      // return res.json(jsonResponse)
      res.send(linesString);
    });
  } catch (error) {
    console.error('Error fetching the file:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;