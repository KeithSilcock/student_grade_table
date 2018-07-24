const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql");
const logger = require("./logger.js");
const webserver = express();
const { credentials, encrypt, secret } = require("./config/mysqlCredentials");
const database = mysql.createConnection(credentials);
const PORT = 9000;

webserver.use(bodyParser.urlencoded({ extended: false }));
webserver.use(bodyParser.json());
database.connect(error => {
  if (error) throw error;
  console.log("successfully connected to database!");
});
webserver.use(express.static(__dirname + "/client" + "/public"));
webserver.use(
  session({
    secret,
    resave: true,
    saveUninitialized: true
  })
);

// endpoints start here
require("./routes")(mysql, webserver, database, encrypt, logger);

webserver.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

webserver.listen(PORT, () => {
  console.log(`Starting webserver.js at port: ${PORT}`);
});
