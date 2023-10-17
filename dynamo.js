"use strict"

const AWS = require('aws-sdk');
const router = require('./routes/books');
require('dotenv').config();

AWS.config.update({
  region: process.env.DEFAULT_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "reading-app";

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

// addOrUpdateUser({
//   id: "0",
//   email: "email@email.com",
//   password: "password",
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
  deleteUser
};

