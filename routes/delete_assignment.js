const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.post("/api/delete_assignment", (req, res) => {
    const output = {
      success: false,
      data: {},
      redirect: ""
    };

    if (
      !req.session.user_id ||
      typeof req.session.permissions[3] === "undefined" ||
      req.session.permissions[3] < 1
    ) {
      logger.simpleLog(__filename, req, null, "User Not Logged In");
      res.json(output);
      return;
    }

    //get data to make sure this is the correct teacher to delete this assignment
    const query =
      "SELECT `assignments`.`teacher_id` FROM `assignments` WHERE `assignments`.`id`=?";
    const inserts = [slashes.add(req.body.assignment_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        // perform check to see if current teacher can delete field

        if (data[0].teacher_id === req.session.user_id) {
          deleteAssignment(slashes.add(req.body.assignment_id));
        } else {
          logger.simpleLog(
            __filename,
            req,
            error,
            "Someone was trying to delete something they shouldn't"
          );
          output.redirect = "/login";
          res.json(output);
        }
      } else {
        logger.simpleLog(__filename, req, error);
        output.redirect = "/login";
        res.json(output);
      }
    });

    function deleteAssignment(assignment_id) {
      const query = [
        "DELETE `assignments`, `student_assignments`",
        "FROM `assignments`",
        "JOIN `student_assignments` ON `assignments`.`id` = `student_assignments`.`assignment_id`",
        "WHERE `assignments`.`id` = ?"
      ].join(" ");

      const inserts = [assignment_id];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          output.success = true;
          res.json(output);
        } else {
          logger.simpleLog(__filename, req, error);
          output.redirect = "/login";
          res.json(output);
        }
      });
    }
  });
};
