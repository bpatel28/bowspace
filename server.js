const Express = require('express'); //express
const auth = require('./routes/auth'); //auth route
const user = require('./routes/user'); //user route

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
App.route('/rest/auth')
    .post(auth.authenticateUser)


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
        Message: 'Welcome to the BowSpace API',
        Status : 'Success'
    });
});

/**
 * get Contacts
 */
App.route("/rest/users")
    .get(user.getUsers);
/**
 * Export for testing
 */
 module.exports = App;
