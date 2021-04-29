const config = require("../config/config");
const sql = require("mssql/msnodesqlv8");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

/**
 * function to collect users or search users info from database
 * @param {*} param0 Optional param UserId or Optional Email, UserName, Keywords
 * @returns
 */
const dbGetUsers = async ({ UserId, Email, UserName, Keywords }) => {
  try {
    let userId = UserId || "";
    let email = Email || "";
    let userName = UserName || "";
    let keywords = Keywords || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);
    sqlRequest.input("UserId", userId);
    sqlRequest.input("Email", email);
    sqlRequest.input("UserName", userName);
    sqlRequest.input("Keywords", keywords);
    sqlResult = await sqlRequest.execute("spGetUsers");

    if (sqlResult) {
      const records = sqlResult.recordset;
      if (
        records.length === 0 ||
        records[0].Status.toUpperCase() !== "SUCCESS"
      ) {
        throw Error("No valid user found.");
      }

      //  collect users data
      let users = [];
      for (const record of records) {
        users.push(new User(record));
      }
      // return data
      return users;
    } else {
      throw Error("SQL error.");
    }
  } catch (error) {}
  return [];
};

/**
 * function to validate user credentials and extract user info.
 * @param {*} param0 Email, UserName, Password
 * @returns user object.
 */
const dbValidateUser = async ({ Email, UserName, Password }) => {
  try {
    let email = Email || "";
    let userName = UserName || "";
    let passowrd = Password || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);
    sqlRequest.input("Email", email);
    sqlRequest.input("UserName", userName);
    sqlRequest.input("Password", passowrd);
    sqlResult = await sqlRequest.execute("spAuthenticateUser");

    if (sqlResult) {
      const records = sqlResult.recordset;
      if (records[0].Status.toUpperCase() !== "SUCCESS") {
        throw Error("No valid user found.");
      }

      // return data
      return new User({
        ...records[0],
        Token: createToken(records[0].FirstName, records[0].Status),
      });
    } else {
      throw Error("SQL error.");
    }
  } catch (err) {}
  return null;
};

/**
 * Function to add new user in database.
 * @param {*} param0 FirstName, LastName, MiddleName, Email, UserName, Password
 * @returns user object.
 */
const dbAddNewUser = async ({
  FirstName,
  LastName,
  MiddleName,
  Email,
  UserName,
  Password,
}) => {
  try {
    let firstName = FirstName || "";
    let lastName = LastName || "";
    let middleName = MiddleName || "";
    let email = Email || "";
    let username = UserName || "";
    let password = Password || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);

    sqlRequest.input("FirstName", firstName);
    sqlRequest.input("LastName", lastName);
    sqlRequest.input("MiddleName", middleName);
    sqlRequest.input("Email", email);
    sqlRequest.input("UserName", username);
    sqlRequest.input("Password", password);
    sqlResult = await sqlRequest.execute("spRegisterUser");

    if (sqlResult) {
      const records = sqlResult.recordset;
      if (
        records.length === 0 ||
        records[0].Status.toUpperCase() !== "SUCCESS"
      ) {
        throw Error("Invalid Request. Check your inputs.");
      }

      // return data
      return new User({
        ...records[0],
        Token: createToken(records[0].FirstName, records[0].Status),
      });
    } else {
      throw Error("SQL error.");
    }
  } catch (error) {}
  return null;
};

/**
 * Function to update user information.
 * @param {*} param0 Optional - FirstName, LastName, MiddleName, Email, UserName, Password
 * @returns
 */
const dbUpdateUserInfo = async ({
  UserId,
  FirstName,
  LastName,
  MiddleName,
  Email,
  UserName,
  Password,
}) => {
  try {
    let userId = UserId || "";
    let firstName = FirstName || "";
    let lastName = LastName || "";
    let middleName = MiddleName || "";
    let email = Email || "";
    let username = UserName || "";
    let password = Password || "";

    const pool = new sql.ConnectionPool(config.database);
    const connection = await pool.connect();
    const sqlRequest = new sql.Request(connection);

    sqlRequest.input("UserId", userId);
    sqlRequest.input("FirstName", firstName);
    sqlRequest.input("LastName", lastName);
    sqlRequest.input("MiddleName", middleName);
    sqlRequest.input("Email", email);
    sqlRequest.input("UserName", username);
    sqlRequest.input("Password", password);
    sqlResult = await sqlRequest.execute("spUpdateUser");

    if (sqlResult) {
      const records = sqlResult.recordset;
      if (
        records.length === 0 ||
        records[0].Status.toUpperCase() !== "SUCCESS"
      ) {
        throw Error("Invalid Request. Check your inputs.");
      }

      // return data
      return new User({
        ...records[0],
      });
    } else {
      throw Error("SQL error.");
    }
  } catch (error) {}
  return null;
};

/**
 * create new jwt token.
 * @param {*} value1 string value to create jwt
 * @param {*} value2 string value to create jwt
 * @returns jwt
 */
const createToken = (value1, value2) => {
  // create token
  const payload = {
    key: value1,
    status: value2,
  };
  const secret = config.secret;
  const options = {
    expiresIn: "2h",
  };
  return jwt.sign(payload, secret, options);
};

/**
 * function to verify given token.
 * @param {*} token
 * @returns decode or error.
 */
const verifyToken = (token) => {
  let result = {};
  try {
    result.decode = jwt.verify(token, config.secret);
  } catch (error) {
    result.error = error;
  }
  return result;
};

module.exports = {
  dbValidateUser,
  dbGetUsers,
  dbAddNewUser,
  dbUpdateUserInfo,
  verifyToken,
};
