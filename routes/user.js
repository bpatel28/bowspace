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

module.exports = { getUsers }