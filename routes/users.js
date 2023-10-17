"use strict";

const express = require("express");
const router = express.Router();
// const axios = require('axios');
const {
  dynamoClient,
  getUsers,
  getUserById,
  addOrUpdateUser,
  deleteUser
} = require('../dynamo');



router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in /users/ route:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in /users/:id route:", error);
    res.status(500).json({ error: "An error occurred while fetching user details." });
  }
});

router.post("/", async (req, res) => {
  const user = req.body;

  try {
    const newUser = await addOrUpdateUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in /users/ route:", error);
    res.status(500).json({ error: "An error occurred while adding user." });
  }
});

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