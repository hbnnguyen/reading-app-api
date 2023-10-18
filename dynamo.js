"use strict"

const AWS = require('aws-sdk');
const router = require('./routes/books');
const bcrypt = require("bcrypt");

require('dotenv').config();

AWS.config.update({
  region: process.env.DEFAULT_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "reading-app";

/**
 * Retrieve a list of users from the DynamoDB table.
 *
 * @returns {Promise<object>} A Promise that resolves to an object containing the list of users.
 * @throws {Error} If there is an error during the retrieval process.
 */
const getUsers = async () => {
  try {
    const params = {
      TableName: TABLE_NAME
    };
    const users = await dynamoClient.scan(params).promise();
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error retrieving users: ", error);
    throw error; // Optionally re-throw the error for the calling code to handle.
  }
};

/**
 * Retrieve a user by their ID from the DynamoDB table.
 *
 * @param {string} id - The unique ID of the user to retrieve.
 * @returns {Promise<object>} A Promise that resolves to an object containing the user data.
 * @throws {Error} If there is an error during the retrieval process.
 */
const getUserById = async (id) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id
      }
    };
    return await dynamoClient.get(params).promise();
  } catch (error) {
    console.error("Error getting user by id: ", error);
  }
};

/**
 * Add or update a user in the DynamoDB table.
 *
 * @param {object} user - The user object to be added or updated.
 * @returns {Promise<object>} A Promise that resolves to an object representing the result of the operation.
 * @throws {Error} If there is an error during the operation.
 */
const addOrUpdateUser = async (user) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Item: user
    };

    return await dynamoClient.put(params).promise();

  } catch (error) {
    console.error("Error updating or creating user: ", error);
  }
};

/**
 * Delete a user from the DynamoDB table by their ID.
 *
 * @param {string} id - The unique ID of the user to delete.
 * @returns {Promise<object>} A Promise that resolves to an object representing the result of the operation.
 * @throws {Error} If there is an error during the deletion process.
 */
const deleteUser = async (id) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id
      }
    };
    return await dynamoClient.delete(params).promise();
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};

async function doesUserExist(idToCheck) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'id = :userId',
    ExpressionAttributeValues: {
      ':userId': idToCheck
    }
  };

  try {
    const data = await dynamoClient.query(params).promise();
    return data.Items.length > 0;
  } catch (err) {
    console.error('Error querying DynamoDB:', err);
    return false; // Return false on error
  }
}

// addOrUpdateUser({
//   id: "0",
//   email: "email@email.com",
//   name: "hannah",
//   age: 22,
//   books: {
//     1342: 40,
//     37106: 3
//   }
// })

// (async () => {
//   const user = await getUserById("0");
//   if (user.Item) {
//     console.log("User found:", user.Item);
//   } else {
//     console.log("User not found.");
//   }
// })();

// getUsers();

module.exports = {
  dynamoClient,
  getUsers,
  getUserById,
  addOrUpdateUser,
  deleteUser,
  doesUserExist
};

