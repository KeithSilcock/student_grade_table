const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.post("/api/add_new_assignment", (req, res) => {
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

    //get assignment average
    const { assignmentData } = req.body;

    const average =
      Object.keys(assignmentData).reduce((acc, student_id) => {
        const info = assignmentData[student_id];
        return acc + info.score / info.points_total;
      }, 0) / Object.keys(assignmentData).length;

    //create new assignment in assignments table
    const query = [
      "INSERT INTO `assignments` (`assignment_name`, `teacher_id`, `class_id`, `average`)",
      "VALUES(?, ?, ?, ?)"
    ].join(" ");
    const inserts = [
      slashes.add(req.body.assignmentName),
      req.session.user_id,
      slashes.add(req.body.class_id),
      average.toFixed(6)
    ];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        output.data.assignment_id = data.insertId;

        addStudentDataToAssignment(data.insertId);
      } else {
        logger.simpleLog(__filename, req, error);
        output.redirect = "/login";
        res.json(output);
      }
    });

    function addStudentDataToAssignment(assignment_id) {
      const { assignmentData } = req.body;

      //formatting data for query insertion
      let queryStrings = "";
      const assignmentValues = Object.keys(assignmentData).map(
        (student_id, index) => {
          const info = assignmentData[student_id];
          queryStrings += `(?,?,?,?,?)`;
          if (index !== Object.keys(assignmentData).length - 1) {
            queryStrings += ",";
          }
          return [
            assignment_id,
            slashes.add(info.score),
            slashes.add(info.points_total),
            slashes.add(info.comments),
            slashes.add(student_id)
          ];
        }
      );

      const query = [
        "INSERT INTO `student_assignments`",
        "(`assignment_id`, `score`, `points_total`, `comments`, `student_id`)",
        `VALUES ${queryStrings}`
      ].join(" ");

      //combining arrays
      const inserts = assignmentValues.reduce((prev, current) => {
        return [...prev, ...current];
      }, []);

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          output.data.student_assignment_inserts = {
            id_start: data.insertID,
            numOfRows: data.affectedRows
          };
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
