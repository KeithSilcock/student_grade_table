const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {

  // ====================
  // ==== Logging In ====
  // ====================
  webserver.post("/api/login", (req, res) => {
    console.log("starting log-in process");
    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
    };

    // ======================
    // Cleaning inputs=====
    // ======================
    const clean_school_id = slashes.add(req.body.school_id);

    const query = `SELECT users.password, users.permissions
        FROM users
        WHERE school_id = ?`;

    const inserts = [clean_school_id];

    const mysqlQuery = mysql.format(query, inserts);

    dataBase.query(mysqlQuery, (err, data, fields) => {
      console.log("Reached user loggin query");
      if (!err) {
        if (data.length > 0) {
          encrypt.compare(
            slashes.add(req.body.password),
            data[0].password,
            (err, compareResponse) => {
              req.session.user_id = clean_school_id;
              getStartingInfo(data[0].permissions);
            }
          );
        } else {
          logger.simpleLog(__filename, req, error);
          res.json(output);
        }
      }
    });

    function getStartingInfo(permissions) {
      // turns permissions integer into an array of bits for permissions
      // not yet implemented
      const current_permissions = permissions
        .toString(2)
        .split("")
        .reverse();

      req.session.permissions = current_permissions;
      output.data.permissions = current_permissions;

      output.success = true;
      res.json(output);
    }
  });
};
