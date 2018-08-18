const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.post("/api/add_student_to_class", (req, res) => {
    const output = {
      success: false,
      data: {},
      redirect: ""
    };

    if (
      !req.session.user_id ||
      typeof req.session.permissions[2] === "undefined" ||
      req.session.permissions[2] < 1
    ) {
      logger.simpleLog(__filename, req, null, "User Not Logged In");
      res.json(output);
      return;
    }
    //check that student exists and isn't teacher
    const query = [
      "SELECT users.id, users.permissions",
      "FROM users",
      "WHERE users.school_id = ?"
    ].join(" ");
    const inserts = [slashes.add(req.body.school_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        if (data[0].permissions <= 1) {
          studentNotInClass();
        } else {
          logger.simpleLog(
            __filename,
            req,
            error,
            "User doesn't exist or is not a student"
          );
          res.json(output);
          return;
        }
      } else {
        logger.simpleLog(__filename, req, error);
        output.redirect = "/login";
        res.json(output);
        return;
      }
    });

    function studentNotInClass() {
      //check that student isn't already in that class
      const query =
        "SELECT `students`.`id` FROM `students` WHERE `students`.`school_id`=? AND `students`.`class_id`=?";
      const inserts = [
        slashes.add(req.body.school_id),
        slashes.add(req.body.class_id)
      ];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          if (!data.length) {
            addStudentToTable();
          } else {
            logger.simpleLog(
              __filename,
              req,
              error,
              "User Already exists in class"
            );
            res.json(output);
            return;
          }
        } else {
          logger.simpleLog(__filename, req, error);
          output.redirect = "/login";
          res.json(output);
          return;
        }
      });
    }

    function addStudentToTable() {
      const query = [
        "INSERT INTO `students` (`students`.`school_id`,",
        "`students`.`first_name`, `students`.`last_name`,",
        "`students`.`class_id`)",
        "VALUES(?,?,?,?)"
      ].join(" ");
      const inserts = [
        slashes.add(req.body.school_id),
        slashes.add(req.body.first_name),
        slashes.add(req.body.last_name),
        slashes.add(req.body.class_id)
      ];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          getAllAssignmentsForClass();
        } else {
          logger.simpleLog(__filename, req, error);
          output.redirect = "/login";
          res.json(output);
          return;
        }
      });
    }

    function getAllAssignmentsForClass() {
      //get list of assignments to update
      const query =
        "SELECT `assignments`.`id` FROM `assignments` WHERE `assignments`.`class_id` = ?";
      const inserts = [slashes.add(req.body.class_id)];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          if (data.length) {
            updateNewStudentAssignments(data);
          } else {
            output.success = true;
            res.json(output);
          }
        } else {
          logger.simpleLog(__filename, req, error);
          output.redirect = "/login";
          res.json(output);
          return;
        }
      });
    }

    function updateNewStudentAssignments(assignement_data) {
      const student_id = slashes.add(req.body.school_id);

      const assignment_ids = assignement_data.map((idObj, index) => {
        return `('${idObj.id}', '${student_id}')`;
      });

      //create new assignment in assignments table
      const query = [
        "INSERT INTO `student_assignments` (`assignment_id`, `student_id`)",
        `VALUES ${assignment_ids.join(", ")}`
      ].join(" ");

      dataBase.query(query, (error, data, fields) => {
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
