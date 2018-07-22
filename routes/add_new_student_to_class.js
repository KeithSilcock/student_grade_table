const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/add_student_to_class", (req, res) => {
    console.log("starting to add student to class");

    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
    };

    if (
      !req.session.user_id ||
      typeof req.session.permissions[2] === "undefined" ||
      req.session.permissions[2] < 1
    ) {
      output.errors.push("not logged in");
      output.redirect = "/login";
      res.json(output);
      return;
    }

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
          output.logMessage = "User already in class";
          res.json(output);
          return;
        }
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
        return;
      }
    });

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
          console.log("Adding student to class: ", req.body.class_id);
          getAllAssignmentsForClass();
        } else {
          output.errors = error;
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
          updateNewStudentAssignments(data);
        } else {
          output.errors = error;
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
          output.errors = error;
          output.redirect = "/login";
          res.json(output);
        }
      });
    }
  });
};
