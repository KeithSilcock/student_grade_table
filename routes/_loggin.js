const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  // ====================
  // ==== Logging In ====
  // ====================
  webserver.post("/api/login", (req, res) => {
    const output = {
      success: false,
      data: {},
      redirect: ""
    };

    // =======================
    // ====Cleaning inputs====
    // =======================
    const clean_school_id = slashes.add(req.body.school_id);

    const query = [
      "SELECT `users`.`password`, `users`.`permissions`",
      "FROM `users`",
      "WHERE `school_id` = ?"
    ].join(" ");

    const inserts = [clean_school_id];

    const mysqlQuery = mysql.format(query, inserts);
    dataBase.query(mysqlQuery, (error, data, fields) => {
      if (!error) {
        if (data.length > 0) {
          encrypt.compare(
            slashes.add(req.body.password),
            data[0].password,
            (error, compareResponse) => {
              req.session.user_id = clean_school_id;
              getStartingInfo(data[0].permissions);
            }
          );
        } else {
          //no user with those params
          output.data.message = "No User";
          res.json(output);
        }
      } else {
        logger.simpleLog(__filename, req, error);
        res.json(output);
        return;
      }
    });

    function getStartingInfo(permissions) {
      // turns permissions integer into an array of bits for permissions
      // not fully implemented yet
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
