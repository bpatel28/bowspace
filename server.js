const Express = require('express'); //express
const config = require('./data/config.js'); // get our config file
const Sql = require('mssql'); // For mssql
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const App = Express(); //middleware to get params from request
const bodyParser = require('body-parser');
App.use(bodyParser.json()); // support json encoded bodies
App.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

//start server
const WebServer = App.listen(5000, function () {
    let Host = WebServer.address().address
    let Port = WebServer.address().port
    console.log("Your express web server is listening at http://%s:%s.", Host, Port)
});

//get sql connection
const Connection = new Sql.ConnectionPool(config.database);

/**
 * Login Path
 */
App.post('/rest/auth', (req, res) => {
    Connection.connect()
        .then(() => {
            //get input from req body
            let Email = req.body.Email === undefined ? '' : req.body.Email;
            let UserName = req.body.UserName === undefined ? '' : req.body.UserName;
            let Password = req.body.Password === undefined ? '' : req.body.Password;

            //execute sp with SqlRequest
            const sqlRequest = new Sql.Request(Connection);
            sqlRequest.input('UserName', UserName);
            sqlRequest.input('Email', Email);
            sqlRequest.input('Password', Password);
            return sqlRequest.execute("spAuthenticateUser");

        }).then(result => {
            //get response status
            let row = result.recordset[0];

            if (row.UserId !== null) {

                //configure jwt
                const payload = {
                    UserName : req.body.UserName,
                    Status : 'Success'
                }
                const secret = config.secret;
                const options = {
                    expiresIn : '2h',
                }

                // create token
                const token = jwt.sign(payload, secret, options);

                //set response
                res.status(200).json({
                    Login : { 
                        UserId : row.UserId,
                        UserName : row.UserName,
                        FirstName : row.FirstName,
                        LastName: row.LastName,
                        Email : row.Email,
                        Token : token,
                    },
                    Status: 'Success'
                });
            } else {
                throw new Error('Login Failed.');
            }
        })
        .catch(err => {

            //set error response
            res.status(500).send({
                Guidance: "Access denied (A4483).",
                Status: "access-denied"
            });
        }).then(() => {
            Connection.close(); //close connection
        });
});

/** 
 * Middleware to verify token
 * */
App.use((req, res, next) => {
    let token = req.body.token || req.headers['x-access-token']; //check for token
    if (token) {
        jwt.verify(token, config.secret, (err, decode) => {
            if (err) {
                //invalid access
                return res.json({
                    Guidance: "Access denied (A4483).",
                    Status: "access denied"
                });
            } else {
                //save decode info in req to use in other route
                req.decode = decode;
                next();
            }
        })
    } else {
        // invalid access
        return res.status(403).send({
            Guidance: "Access denied (A4483).",
            Status: "access denied"
        });
    }
});

/**
 * Default Path
 */
App.get('/', (req, res) => {
    res.json({
        Message: 'Welcome to the BowSpace API'
    });
});

/**
 * Export for testing
 */

 module.exports = App;
