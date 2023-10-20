"use strict";

const express = require("express");
const {
  getUsers,
  getUserById,
  addOrUpdateUser,
  deleteUser,
  doesUserExist
} = require('../dynamo');

const Passage = require("@passageidentity/passage-node");
const router = express.Router();

//
const passage = new Passage({
  appID: process.env.PASSAGE_APP_ID,
  apiKey: process.env.PASSAGE_API_KEY,
  authStrategy: "HEADER",
});



router.post("/", async (req, res) => {
  try {
    const userID = await passage.authenticateRequest(req);

    if (userID) {
      // user is authenticated
      const { email } = await passage.user.get(userID);
      const identifier = email;

      // if user doesn't exist in db, add them
      if (await doesUserExist(userID) === false) {
        await addOrUpdateUser({
          id: userID,
          email: email,
          name: "",
          age: null,
          books: {},
          texts: {}
        })
      }

      res.json({
        authStatus: "success",
        identifier,
        userID
      });
    }
  } catch (e) {
    // authentication failed
    console.log(e);
    res.json({
      authStatus: "failure",
    });
  }
});

module.exports = router;
