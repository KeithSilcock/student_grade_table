const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const webserver = express();
const { credentials } = require('./config/mysqlCredentials');
const database = mysql.createConnection( credentials );
const PORT = 9000;


webserver.use(bodyParser.urlencoded( {extended: false} ));
webserver.use(bodyParser.json());
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