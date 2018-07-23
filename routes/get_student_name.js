const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.post("/api/get_student_name", (req, res, next) => {
    console.log("Getting data for student name");

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
      logger.simpleLog(__filename, req, error, "User Not Logged In");
      res.json(output);
      return;
    }

    //getting student's first and last name for teacher confirmation
    const query = [
      "SELECT `users`.`first_name`, `users`.`last_name`",
      "FROM `users`",
      "WHERE `users`.`school_id`=?"
    ].join(" ");
    const inserts = [slashes.add(req.body.student_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        if (data.length) {
          output.data.first_name = data[0].first_name;
          output.data.last_name = data[0].last_name;

          output.success = true;
          res.json(output);
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
