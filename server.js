const Express = require('express');
const config = require('./data/config.js'); // get our config file
const Sql = require('mssql'); // For mssql
const App = Express();

const WebServer = App.listen(8888, function () {
    let Host = WebServer.address().address
    let Port = WebServer.address().port
    console.log("Your express web server is listening at http://%s:%s.", Host, Port)
});

const Connection = new Sql.ConnectionPool(config.database);

App.get('/', function (req, res) {
    
    res.send('This is the Bowspace API');
});