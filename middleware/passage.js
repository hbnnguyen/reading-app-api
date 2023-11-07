// import Passage from "@passageidentity/passage-node";

const Passage = require("@passageidentity/passage-node");
const passageConfig = {
  appID: process.env.PASSAGE_APP_ID,
  apiKey: process.env.PASSAGE_API_KEY,
  authStrategy: "HEADER",
};

// passage middleware
// let passageAuthMiddleware = (() => {
//   return async (req, res, next) => {
//     try {
//       let userID = await passage.authenticateRequest(req);
//       if (userID) {
//         // user is authenticated
//         res.userID = userID;
//         next();
//       }
//     } catch (e) {
//       // unauthorized
//       console.log(e);
//       res.status(401).send('Could not authenticate user!');
//     }
//   };
// })();

// const passageAuthMiddleware = () => {
//   return async (req, res, next) => {
//     console.log("hello");
//     try {
//       let userID = await passage.authenticateRequest(req.params.id);
//       if (userID) {
//         // user is authenticated
//         res.userID = userID;
//         next();
//       }
//     } catch (e) {
//       // unauthorized
//       console.log(e);
//       res.status(401).send('Could not authenticate user!');
//     }
//   };
// };
// let passage = new Passage(passageConfig);
let passage = new Passage(passageConfig)
async function passageAuthMiddleware(req, res, next) {
  try {
    // console.log(req.headers)
    let userID = await passage.authenticateRequest(req);
    if (userID) {
      // user is authenticated
      res.userID = userID;
      next();
    }
  } catch (e) {
    // unauthorized
    console.log(e);
    res.status(401).send('Could not authenticate user!');
  }
}

module.exports = {
  passageAuthMiddleware
};

// authenticated route that uses middleware
// app.get("/auth", passageAuthMiddleware, async (req, res) => {
//   let userID = res.userID;
//   // proceed
// });