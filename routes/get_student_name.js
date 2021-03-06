const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.post("/api/get_student_name", (req, res, next) => {
    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
    };
    if (
      !req.session.user_id ||
      typeof req.session.permissions[1] === "undefined" ||
      req.session.permissions[1] < 1
    ) {
      logger.simpleLog(__filename, req, null, "User Not Logged In");
      res.json(output);
      return;
    }

    //getting student's first and last name for teacher confirmation
    const query = [
      "SELECT `users`.`first_name`, `users`.`last_name`, `users`.`permissions`",
      "FROM `users`",
      "WHERE `users`.`school_id`=?"
    ].join(" ");
    const inserts = [slashes.add(req.body.student_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        if (data.length) {
          if (data[0].permissions <= 1) {
            output.data.first_name = data[0].first_name;
            output.data.last_name = data[0].last_name;

            output.success = true;
            res.json(output);
          } else {
            //trying to look up teacher. Not allowed
            output.data.first_name = "<not found>";
            res.json(output);
            return;
          }
        } else {
          output.data.first_name = "<not found>";
          res.json(output);
          return;
        }
      } else {
        logger.simpleLog(__filename, req, error);
        output.redirect = "/login";
        res.json(output);
      }
    });
  });
};
