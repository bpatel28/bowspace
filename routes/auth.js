const Connection = require('../config/connection'); //get the connection
const Sql = require('mssql');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config/config');

const authenticateUser = (Email, UserName, Password) => {
    return Connection.connect()
        .then(() => {
            //execute sp with SqlRequest
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('UserName', UserName);
            sqlRequest.input('Email', Email);
            sqlRequest.input('Password', Password);
            return sqlRequest.execute("spAuthenticateUser");
        }).then((result) => {
            let userInfo = result.recordset[0];
            if (userInfo.UserId !== null) {

                //configure jwt
                const payload = {
                    UserName: UserName,
                    Status: 'Success'
                }
                const secret = config.secret;
                const options = {
                    expiresIn: '2h',
                }

                // create token
                const token = jwt.sign(payload, secret, options);
                Connection.close();
                return {
                    Login : {
                        UserId: userInfo.UserId,
                        UserName: userInfo.UserName,
                        FirstName: userInfo.FirstName,
                        LastName: userInfo.LastName,
                        Email: userInfo.Email,
                        Token: token,
                    }
                };
            } else {
                Connection.close();
                throw new Error('Login Failed');
            }
        });
};

const verifyToken = (token) => {
    let result = {};
    try {
        result.decode = jwt.verify(token, config.secret);
    } catch (error) {
        result.err = errror;
    } 
    return result;
};

//export functions
module.exports = {authenticateUser, verifyToken};