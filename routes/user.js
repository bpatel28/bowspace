const Connection = require('../config/connection'); //get the connection
const Sql = require('mssql');

const getUsers = (req, res) => {
    //get user info
    let userId = req.params.UserId === undefined ? '' : req.params.UserId;
    let userName = req.params.UserName === undefined ? '' : req.params.UserName;
    let keywords = req.params.Keywords === undefined ? '' : req.params.Keywords;
    
    Connection.connect()
    .then(() => {
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
        console.log(err);
        res.status(500).json({
            Guidance: "Invalid Request. Check your params.",
            Status: "Error"
        });
    });
}

module.exports = { getUsers }