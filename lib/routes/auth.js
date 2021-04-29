const { dbValidateUser } = require("../utils/user-utils");

/**
 * Authenticate user route
 * @param {*} req
 * @param {*} res
 */
const authenticateUser = async (req, res) => {
  try {
    const user = await dbValidateUser(req.body);

    if (!user) throw Error("No User found.");

    // set response
    res.status(200).json({
      ...user,
      Status: "Success",
      Message: "User successfully Authenticated.",
    });
  } catch (err) {
    //set error response
    res.status(500).json({
      Guidance: "Access denied (A4483).",
      Status: "Failed",
    });
  }
};

module.exports = authenticateUser;
