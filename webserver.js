const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const {credentials} = require('./config/mysqlCredentials');


const webserver = express();
const database = mysql.createConnection(credentials);

webserver.use(express.static(__dirname + "/client" + "/public"));
webserver.use(bodyParser.urlencoded( {extended: false} ));
webserver.use(bodyParser.json);


database.connect( (error) => {
    if(error) throw error;
    console.log("successfully connected to database!")
})

const port = 9000;
webserver.listen(port, () => {
    console.log(`Starting webserver.js at port: ${port}`);
});