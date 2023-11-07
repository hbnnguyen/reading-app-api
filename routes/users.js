"use strict";

const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  addOrUpdateUser,
  deleteUser
} = require('../dynamo');
const {passageAuthMiddleware} = require('../middleware/passage')

/** Router for user-related routes. */

// Get a list of all users.
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users.Items);
  } catch (error) {
    console.error("Error in /users/ route:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});


// Get user details by their ID.
router.get("/:id", passageAuthMiddleware, async (req, res) => {
  // const id = req.params.id;
  let userID = res.userID

  try {
    const user = await getUserById(userID);
    // console.log(user)
    res.status(200).json(user.Item);
  } catch (error) {
    console.error("Error in /users/:id route:", error);
    res.status(500).json({ error: "An error occurred while fetching user details." });
  }
});


// Add a new user.
router.post("/", async (req, res) => {
  const user = req.body;
  user.name = "";
  user.age = null;
  user.books = {};
  user.texts = {};

  try {
    const newUser = await addOrUpdateUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in /users/ route:", error);
    res.status(500).json({ error: "An error occurred while adding user." });
  }
});

// Update user details by their ID.
router.put("/:id", async (req, res) => {
  const user = req.body;
  const id = req.params.id;
  user.id = id;

  try {
    const updatedUser = await addOrUpdateUser(user);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in /users/:id route:", error);
    res.status(500).json({ error: "An error occurred while updating user." });
  }
});

// Delete a user by their ID.
router.delete("/:id", async (req, res) => {
  user.id = id;
  try {
    res.status(200).json(await deleteUser(id));
  } catch (error) {
    console.error("Error in /users/:id route:", error);
    res.status(500).json({ error: "An error occurred while updating user." });
  }
});

module.exports = router;