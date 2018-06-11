const express = require('express');
const session = require("express-session");
const expressValidator = require("express-validator");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const webserver = express();
const { credentials, secret } = require('./config/mysqlCredentials');
const database = mysql.createConnection( credentials );
const PORT = 9000;


webserver.use(bodyParser.urlencoded( {extended: false} ));
webserver.use(bodyParser.json());
webserver.use(expressValidator());
webserver.use(session(secret));

database.connect( (error) => {
    if(error) throw error;
    console.log("successfully connected to database!")
});
webserver.use(express.static(__dirname + "/client" + "/public"));


// endpoints start here
require('./routes')(mysql, webserver, database);

webserver.get('/test', (req, res) => {
    console.log('Someone reached the test')
    res.send({
        success: true,
    })
});

webserver.listen(PORT, () => {
    console.log(`Starting webserver.js at port: ${PORT}`);
});