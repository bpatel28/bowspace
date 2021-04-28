const config = require("../config/config");
const sql = require("mssql/msnodesqlv8");
const Post = require("../model/Post");
const { getUsers } = require("./user-utils");

/**
 * function to filter and collect post from database.
 * @param {*} param0 Optional params PostId, SenderId, ReceiverId, Keywords or Date
 * @returns
 */
const getPosts = async ({
  PostId,
  SenderId,
  ReceiverId,
  Keywords,
  Timestamp,
}) => {
  try {
    let postId = PostId || "";
    let senderId = SenderId || "";
    let receiverId = ReceiverId || "";
    let keywords = Keywords || "";
    let timestamp = Timestamp || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);
    sqlRequest.input("PostId", postId);
    sqlRequest.input("SenderId", senderId);
    sqlRequest.input("ReceiverId", receiverId);
    sqlRequest.input("Keywords", keywords);
    sqlRequest.input("Timestamp", timestamp);
    sqlResult = await sqlRequest.execute("spGetPosts");

    if (sqlResult) {
      const records = sqlResult.recordset;

      if (records[0].Status.toUpperCase() !== "SUCCESS") {
        throw Error("No valid post found.");
      }

      let posts = [];

      // create post object from result.
      for (const record of records) {
        //collect user data.
        const [sender] = await getUsers({ UserId: record.SenderId });
        const [receiver] = await getUsers({ UserId: record.ReceiverId });

        let post = new Post({
          PostId: record.PostId,
          Sender: {
            UserId: sender.UserId,
            FirstName: sender.FirstName,
            LastName: sender.LastName,
            Email: sender.Email,
            UserName: sender.UserName,
            ValidFrom: sender.ValidFrom,
          },
          Receiver: {
            UserId: receiver.UserId,
            FirstName: receiver.FirstName,
            LastName: receiver.LastName,
            Email: receiver.Email,
            UserName: receiver.UserName,
            ValidFrom: receiver.ValidFrom,
          },
          PostHtml: record.PostHtml,
          Timestamp: record.Timestamp,
        });

        // return data
        posts.push(post);
      }
      return posts;
    } else {
      throw Error("SQL error.");
    }
  } catch (error) {
    return [];
  }
};

/**
 * function to create new post in databbase.
 * @param {*} param0 required params SenderId, ReceiverId and PostHtml
 * @returns
 */
const addPost = async ({ SenderId, ReceiverId, PostHtml }) => {
  try {
    let senderId = SenderId || "";
    let receiverId = ReceiverId || "";
    let postHtml = PostHtml || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);
    sqlRequest.input("SenderId", senderId);
    sqlRequest.input("ReceiverId", receiverId);
    sqlRequest.input("PostHtml", postHtml);
    sqlResult = await sqlRequest.execute("spCreatePost");

    if (sqlResult) {
      const records = sqlResult.recordset;
      if (
        records.length === 0 ||
        records[0].Status.toUpperCase() !== "SUCCESS"
      ) {
        throw Error("Couldn't add new post.");
      }

      const [record] = records;
      const [sender] = await getUsers({ UserId: record.SenderId });
      const [receiver] = await getUsers({ UserId: record.ReceiverId });

      let post = new Post({
        PostId: record.PostId,
        Sender: {
          UserId: sender.UserId,
          FirstName: sender.FirstName,
          LastName: sender.LastName,
          Email: sender.Email,
          UserName: sender.UserName,
          ValidFrom: sender.ValidFrom,
        },
        Receiver: {
          UserId: receiver.UserId,
          FirstName: receiver.FirstName,
          LastName: receiver.LastName,
          Email: receiver.Email,
          UserName: receiver.UserName,
          ValidFrom: receiver.ValidFrom,
        },
        PostHtml: record.PostHtml,
        Timestamp: record.Timestamp,
      });

      // return data
      return post;
    } else {
      throw Error("SQL error.");
    }
  } catch (error) {
    return null;
  }
};

/**
 * function to delete post from database.
 * @param {*} param0 required PostId
 * @returns
 */
const deletePost = async ({ PostId }) => {
  try {
    let postId = PostId || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);
    sqlRequest.input("PostId", postId);
    sqlResult = await sqlRequest.execute("spDeletePost");

    if (sqlResult) {
      const records = sqlResult.recordset;
      if (
        records.length === 0 ||
        records[0].Status.toUpperCase() !== "SUCCESS"
      ) {
        throw Error("Couldn't delete post.");
      }

      const [record] = records;

      // return data
      return record.PostId;
    } else {
      throw Error("SQL error.");
    }
  } catch (error) {
    return null;
  }
};

module.exports = { getPosts, addPost, deletePost };
