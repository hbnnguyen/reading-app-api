"use strict";

const express = require("express");
const router = express.Router();
const axios = require('axios');
// const nthline = require('nthline')
const readline = require('readline');
const { PassThrough } = require('stream');

/** Router for book-related routes. */

/**
 * Makes a request to the Gutendex API.
 *
 * @param {string} endpoint - The API endpoint to request.
 * @param {object} data - Optional data for the request body.
 * @param {string} method - The HTTP method (default: "get").
 * @returns {Promise<object>} A Promise that resolves to the response data from the API.
 * @throws {Error} If there is an error during the API request.
 */
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

// Retrieve a list of books from the Gutendex API.
router.get("/", async function (req, res, next) {
  try {
    const books = await gutendexRequest("books");
    return res.status(200).json({ books });
  } catch (error) {
    console.error("Error in /books/ route:", error);
    res.status(500).json({ error: "An error occured while fetching books." });
  }
});

// Retrieve book details by its ID from the Gutendex API.
router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    const book = await gutendexRequest(`books/${id}`);
    return res.status(200).json({ book });
  } catch (error) {
    console.error(`Error in /books/:id route with id ${id}:`, error);
    res.status(500).json({ error: "An error occured while fetching book details." });
  }
});

// Retrieve the text of a book by its ID from the Gutendex API.
router.get("/:id/text", async function (req, res, next) {
  const id = req.params.id;
  try {
    const book = await gutendexRequest(`books/${id}`);
    const bookText = book.formats["text/plain; charset=us-ascii"];

    return res.status(200).json({ bookText });
  } catch (error) {
    console.error(`Error in /books/:id/text route with id ${req.params.id}`, error);
    res.status(500).json({ error: "An error occurred while fetching book text." });
  }
});

// Retrieve a page of text from a book by its ID and page number.
router.get("/:id/text/:pageNumber", async function (req, res, next) {
  const id = req.params.id;

  try {
    const book = await gutendexRequest(`books/${id}`);
    const pageNumber = parseInt(req.params.pageNumber);
    const lineStart = (pageNumber - 1) * 40;
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
      // return res.status(200).json(jsonResponse)
      res.send(linesString);
    });
  } catch (error) {
    console.error('Error fetching the file:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;