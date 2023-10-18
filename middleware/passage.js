// import Passage from "@passageidentity/passage-node";
// const passageConfig = {
//   appID: process.env.PASSAGE_APP_ID,
//   apiKey: process.env.PASSAGE_API_KEY,
// };
// // passage middleware
// let passage = new Passage(passageConfig);
// export let passageAuthMiddleware = (() => {
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

// // // authenticated route that uses middleware
// // app.get("/auth", passageAuthMiddleware, async (req, res) => {
// //   let userID = res.userID;
// //   // proceed
// // });