const Express = require('express'); //express

const Connection = require('./config/connection'); //get the connection
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config/config');
const auth = require('./routes/auth');

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

/**
 * Login Path
 */
App.post('/rest/auth', (req, res) => {
    //get input from req body
    let Email = req.body.Email === undefined ? '' : req.body.Email;
    let UserName = req.body.UserName === undefined ? '' : req.body.UserName;
    let Password = req.body.Password === undefined ? '' : req.body.Password;
    //call function from auth route
    auth.authenticateUser(Email, UserName, Password)
        .then(result => {
                //set response
                res.status(200).json({
                    Login: result.Login,
                    Status: 'Success',
                });
        })
        .catch(err => {
            //set error response
            res.status(500).send({
                Guidance: "Access denied (A4483).",
                Status: "access-denied"
            });
        });
});

/** 
 * Middleware to verify token
 * */
App.use((req, res, next) => {
    let token = req.body.token || req.headers['x-access-token']; //check for token
    if (token) {
        //call function from auth route
        let result = auth.verifyToken(token);
        if (result.err) {
            //set error response
            return res.status(403).send({
                Guidance: "Access denied (A4483).",
                Status: "access denied"
            });
        } else {
            //set decode in req to use it in other routes
            req.decode = result.decode;
            next();
        }
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
