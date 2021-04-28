const express = require("express");
const cors = require("cors");

const auth = require("./lib/routes/auth"); //auth route
const user = require("./lib/routes/user"); //user route
const post = require("./lib/routes/post"); //post route

const { verifyToken } = require("./lib/utils/user-utils");

const app = express();

app.use(express.json()); // middleware to parse POST body
app.use(cors()); // Cross-Origin Resource Sharing

const port = process.env.PORT || 8888;

// Starting server
const webServer = app.listen(port, () => {
  let host = webServer.address().address;
  console.log(
    `Your express web server is listening at http://${host}:${port}.`
  );
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    Message: "Welcome to the BowSpace API",
    Status: "Success",
  });
});

// Login route
app.route("/rest/auth").post(auth);

// Register User route
app.route("/rest/user").put(user.registerUser);

// Set up middleware
app.use((req, res, next) => {
  try {
    let token = req.body.token || req.headers["x-access-token"];
    if (!token) throw Error("Invalid Token!");
    let result = verifyToken(token);

    if (result.error) throw Error("Invalid Token!");

    req.decode = result.decode;
    next();
  } catch (error) {
    // invalid access
    return res.status(403).send({
      Guidance: "Access denied (A4483).",
      Status: "Failed",
    });
  }
});

// route for update user or get users.
app.route("/rest/user").post(user.updateUser).get(user.searchUsers);

// route for add post, delete post or get posts.
app
  .route("/rest/post")
  .get(post.searchPosts)
  .put(post.createPost)
  .delete(post.removePost);

// export for testing
module.exports = app;
