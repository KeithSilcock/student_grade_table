const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.post("/api/update_score", (req, res) => {
    console.log("starting update score procedure");

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

    const clean_assignment_id = slashes.add(req.body.assignment_id);
    const clean_student_assignment_id = slashes.add(
      req.body.student_assignment_id
    );
    const clean_column_name = slashes.add(req.body.column_name);
    const clean_column_value = slashes.add(req.body.column_value);

    //Determine which table to update
    if (clean_column_name === "assignment_name") {
      updateAssignmentName();
    } else {
      updateScore();
    }

    function updateAssignmentName() {
      const query = [
        "UPDATE `assignments`",
        "SET `assignments`.?? = ?",
        "WHERE `assignments`.`id` = ? AND `assignments`.`teacher_id`=?"
      ].join(" ");

      const inserts = [
        clean_column_name,
        clean_column_value,
        clean_assignment_id,
        req.session.user_id
      ];

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

    function updateScore() {
      //get data to make sure this is the correct teacher to delete this assignment
      const query =
        "SELECT `assignments`.`teacher_id` FROM `assignments` WHERE `assignments`.`id`=?";
      const inserts = [clean_assignment_id];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          // perform check to see if current teacher change score

          if (data[0].teacher_id === req.session.user_id) {
            changeScore();
          } else {
            logger.simpleLog(
              __filename,
              req,
              error,
              "Someone unverified was trying to alter a grade"
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
    }

    function changeScore() {
      const query = [
        "UPDATE `student_assignments`",
        "SET ??=?",
        "WHERE `student_assignments`.`id`=?"
      ].join(" ");

      const inserts = [
        clean_column_name,
        clean_column_value,
        clean_student_assignment_id
      ];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          getScoresToUpdate();
        } else {
          logger.simpleLog(__filename, req, error);
          output.redirect = "/login";
          res.json(output);
        }
      });
    }

    function getScoresToUpdate() {
      const query = [
        "SELECT `student_assignments`.`score`, `student_assignments`.`points_total`",
        "FROM `student_assignments`",
        "WHERE `student_assignments`.`assignment_id`=?"
      ].join(" ");

      const inserts = [clean_assignment_id];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          //get average
          data;
          const average = data.reduce((acc, curr) => {
            return acc + curr.score / curr.points_total;
          }, 0);

          updateAverage(average / data.length);
        } else {
          logger.simpleLog(__filename, req, error);
          output.redirect = "/login";
          res.json(output);
        }
      });
    }
    function updateAverage(avg) {
      const query = [
        "UPDATE `assignments`",
        "SET `average` = ? ",
        "WHERE `assignments`.`id` = ?"
      ].join(" ");

      const inserts = [avg.toFixed(6), clean_assignment_id];

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
