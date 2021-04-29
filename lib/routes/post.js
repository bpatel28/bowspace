const { dbGetPosts, dbAddPost, dbDeletePost } = require("../utils/post-utils");

/**
 * Search Post route
 * @param {*} req
 * @param {*} res
 */
const searchPosts = async (req, res) => {
  try {
    const posts = await dbGetPosts(req.query);

    if (!posts) throw Error("Couldn't find post.");

    //set response
    res.status(200).json({
      Posts: posts,
      Status: "Success",
      Message: "Search complete.",
    });
  } catch (error) {
    //set error response
    res.status(500).json({
      Guidance: "Invalid Request. Please check your params.",
      Status: "Failed",
    });
  }
};

/**
 * Create new post route
 * @param {*} req
 * @param {*} res
 */
const createPost = async (req, res) => {
  try {
    const post = await dbAddPost(req.body);

    if (!post) throw Error("Couldn't create new post.");

    // set response
    res.status(200).json({
      ...post,
      Status: "Success",
      Message: "Created new post.",
    });
  } catch (error) {
    //set error response
    res.status(500).json({
      Guidance: "Invalid Request. Please check your inputs.",
      Status: "Failed",
    });
  }
};

/**
 * Delete post route.
 * @param {*} req
 * @param {*} res
 */
const removePost = async (req, res) => {
  try {
    const postId = await dbDeletePost(req.body);

    if (!postId) throw Error("Couldn't delete post.");

    // set response
    res.status(200).json({
      PostId: postId,
      Status: "Success",
      Message: `Deletetd post ${postId}.`,
    });
  } catch (error) {
    //set error response
    res.status(500).json({
      Guidance: "Invalid Request. Please check your inputs.",
      Status: "Failed",
    });
  }
};

module.exports = { searchPosts, createPost, removePost };
