const config = require('./config.js'); // get our config file
const Sql = require('mssql'); // For mssql
//get sql connection
const Connection = new Sql.ConnectionPool(config.database);

module.exports = Connection;