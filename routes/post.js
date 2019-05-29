const Connection = require('../config/connection'); //get the connection
const Sql = require('mssql'); //ms sql

/**
 * get post from database
 * @param {*} req 
 * @param {*} res 
 */
const getPosts = (req, res) => {
    //get query params
    console.log(req.query);
    let postId = req.query.PostId === undefined ? '' : req.query.PostId;
    let senderId = req.query.SenderId === undefined ? '' : req.query.SenderId;
    let receiverId = req.query.ReceiverId === undefined ? '' : req.query.ReceiverId;
    let keywords = req.query.Keywords === undefined ? '' : req.query.Keywords;
    let timestamp = req.query.Timestamp === undefined ? '' : req.query.Timestamp;

    Connection.connect() 
        .then((pool) => {
            // make sql request
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('PostId', postId);
            sqlRequest.input('SenderId', senderId);
            sqlRequest.input('ReceiverId', receiverId);
            sqlRequest.input('Keywords', keywords);
            sqlRequest.input('Timestamp', timestamp);
            return sqlRequest.execute('spGetPosts');
        }).then(result => {
            let rows = result.recordset;
            //set response
            res.status(200).json({
                Posts : rows,
                Status : 'Success'
            });
        }).catch(err => {
            //set error response
            res.status(500).json({
                Guidance: "Invalid Request. Check your params.",
                Status: "Error"
            });
        }).then(() => {
            Connection.close();
        });
};

/**
 * create new post
 * @param {*} req 
 * @param {*} res 
 */
const createPost = (req, res) => {
    //collect info from body
    let senderId = req.body.SenderId === undefined ? '' : req.body.SenderId;
    let receiverId = req.body.ReceiverId === undefined ? '' : req.body.ReceiverId;
    let postHtml = req.body.PostHtml === undefined ? '' : req.body.PostHtml;

    Connection.connect()
        .then(pool => {
            //execte sp with sqlrequest
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('SenderId', senderId);
            sqlRequest.input('ReceiverId', receiverId);
            sqlRequest.input('PostHtml', postHtml);
            return sqlRequest.execute('spCreatePost');
        }).then(result => {
            //set response
            let PostId = result.recordset[0];
            res.status(200).json({
                PostId,
                Status : 'Success'
            });
        }).catch(err => {
            console.log(err);
            //set error response
            res.status(500).json({
                Guidance: "Invalid Request.",
                Status: "Error"
            });
        }).then(() => {
            Connection.close();
        });
}

module.exports = { getPosts, createPost }