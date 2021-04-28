const { getUsers, addNewUser, updateUserInfo } = require("../utils/user-utils");

/**
 * route to search user.
 * @param {*} req
 * @param {*} res
 */
const searchUsers = async (req, res) => {
  try {
    const users = await getUsers(req.query);

    if (!users) throw Error("Couldn't find user.");

    // set response
    res.status(200).json({
      Users: users.map((usr) => {
        return {
          UserId: usr.UserId,
          FirstName: usr.FirstName,
          LastName: usr.LastName,
          Email: usr.Email,
          UserName: usr.UserName,
          ValidFrom: usr.ValidFrom,
        };
      }),
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
 * route to register new user.
 * @param {*} req
 * @param {*} res
 */
const registerUser = async (req, res) => {
  try {
    const user = await addNewUser(req.body);

    if (!user) throw Error("Couldn't add new user.");

    // set response
    res.status(200).json({
      ...user,
      Status: "Success",
      Message: "User successfully registered.",
    });
  } catch (error) {
    //set error response
    res.status(500).json({
      Guidance: "Invalid Request. Check your inputs.",
      Status: "Failed",
    });
  }
};

/**
 * route to update user information
 * @param {*} req
 * @param {*} res
 */
const updateUser = async (req, res) => {
  try {
    const user = await updateUserInfo(req.body);

    if (!user) throw Error("Couldn't update user info.");

    const { Token, ...userinfo } = user; // removing token since not needed in response.

    // set response
    res.status(200).json({
      ...userinfo,
      Status: "Success",
      Message: "Information successfully updated.",
    });
  } catch (error) {
    //set error response
    res.status(500).json({
      Guidance: "Invalid Request. Check your inputs.",
      Status: "Failed",
    });
  }
};

module.exports = { searchUsers, registerUser, updateUser };
