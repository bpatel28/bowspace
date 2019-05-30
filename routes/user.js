const Connection = require('../config/connection'); //get the connection
const Sql = require('mssql'); 

/**
 * get users from database
 * @param {*} req 
 * @param {*} res 
 */
const getUsers = (req, res) => {
    //get user info
    let userId = req.query.UserId === undefined ? '' : req.query.UserId;
    let userName = req.query.UserName === undefined ? '' : req.query.UserName;
    let keywords = req.query.Keywords === undefined ? '' : req.query.Keywords;
    
    Connection.connect()
        .then((pool) => {
            //execute sp with sql request
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('UserId', userId);
            sqlRequest.input('UserName', userName);
            sqlRequest.input('Keywords', keywords);
            return sqlRequest.execute('spGetUsers');
        }).then((result) => {
                let rows = result.recordset;
                //set response
                res.status(200).json({
                    Users: rows,
                    Status: 'Success'
                });
        }).catch((err) => {
            res.status(500).json({
                Guidance: "Invalid Request. Check your params.",
                Status: "Error"
            });
        }).then(() => {
            Connection.close();
        });
}

/**
 * Register new account
 * @param {*} req 
 * @param {*} res 
 */
const registerUser = (req, res) => {
    //get user info
    let firstName = req.body.FirstName === undefined ? '' : req.body.FirstName;
    let lastName = req.body.LastName === undefined ? '' : req.body.LastName;
    let email = req.body.Email === undefined ? '' : req.body.Email;
    let password = req.body.Password === undefined ? '' : req.body.Password;
    let username = req.body.UserName === undefined ? '' : req.body.UserName;

    Connection.connect()
        .then(pool => {
            //make sql request
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('FirstName', firstName);
            sqlRequest.input('LastName', lastName);
            sqlRequest.input('Email', email);
            sqlRequest.input('UserName', username);
            sqlRequest.input('Password', password);
            return sqlRequest.execute('spRegisterUser');
        }).then(result => {
            let row = result.recordset[0];
            if (row.Status === 'Success') {
                //set success response
                res.status(200).json({
                    UserId : row.UserId,
                    Message : 'User successfully registered',
                    Status : row.Status
                });
            } else {
                //error response
                res.status(500).json({
                    Guidance: row.Guidance,
                    Status : row.Status,
                });
            }
        }).catch(err => {
            //error response
            res.status(500).json({
                Guidance: "Invalid Request. Check your inputs.",
                Status: "Error"
            });
        }).then(() => {
            Connection.close();
        });
};

const updateUser = (req, res) => {
    //get user info
    let userId = req.body.UserId === undefined ? '' : req.body.UserId;
    let firstName = req.body.FirstName === undefined ? '' : req.body.FirstName;
    let lastName = req.body.LastName === undefined ? '' : req.body.LastName;
    let email = req.body.Email === undefined ? '' : req.body.Email;
    let password = req.body.Password === undefined ? '' : req.body.Password;
    let username = req.body.UserName === undefined ? '' : req.body.UserName;

    Connection.connect()
        .then(pool => {
            //make sql request
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('UserId', userId);
            sqlRequest.input('FirstName', firstName);
            sqlRequest.input('LastName', lastName);
            sqlRequest.input('UserName', username);
            sqlRequest.input('Email', email);
            sqlRequest.input('Password', password);
            return sqlRequest.execute('spUpdateUserInfo');
        }).then(result => {
            let row = result.recordset[0];
            if (row.Status === 'Success') {
                //set success response
                res.status(200).json(row);
            } else {
                //error response
                res.status(500).json(row);
            }
        }).catch(err => {
            //error response
            res.status(500).json({
                Guidance: "Invalid Request. Check your inputs.",
                Status: "Error"
            });
        }).then(() => {
            Connection.close();
        });
};

module.exports = { getUsers, registerUser, updateUser }