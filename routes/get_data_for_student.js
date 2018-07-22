module.exports = (mysql, webserver, database) => {
  webserver.get("/api/get_data_for_student", (req, res) => {
    console.log("Getting individual student data");

    const output = {
      success: false,
      data: {},
      errors: []
    };

    if (
      !req.session.user_id ||
      typeof req.session.permissions[0] === "undefined" ||
      req.session.permissions[0] < 1
    ) {
      output.errors.push("not logged in");
      output.redirect = "/login";
      res.json(output);
      return;
    }

    const query = `SELECT students.first_name, students.last_name, students.class_id
    FROM students
    WHERE students.school_id=?`;

    const inserts = [req.session.user_id];

    const sqlQuery = mysql.format(query, inserts);

    database.query(sqlQuery, (err, data, fields) => {
      if (!err) {
        output.data.name = `${data[0].first_name} ${data[0].last_name}`;
        output.data.id = `${req.session.user_id}`;
        const classes = data.map((student, index) => {
          return student.class_id;
        });
        getClasses(classes);
      } else {
        output.errors = err;
      }
    });

    function getClasses(classes) {
      const query = `SELECT classes.class_name, classes.description, classes.id
      FROM classes
      WHERE classes.id IN (${formatInserts(classes)})`;

      const inserts = [...classes];

      const sqlQuery = mysql.format(query, inserts);

      database.query(sqlQuery, (err, data, fields) => {
        if (!err) {
          const courses = data.reduce((prev, current) => {
            const newCourse = {
              [current.class_name]: {
                class_description: current.description,
                class_id: current.id
              }
            };
            return Object.assign(prev, newCourse);
          }, {});
          output.data.classes = courses;
          getTeacherData(classes);
        } else {
          output.errors = err;
        }
      });
    }

    function getTeacherData(classes) {
      const query = `SELECT teachers.first_name, teachers.last_name, teachers.class_id
      FROM teachers
      WHERE teachers.class_id IN (${formatInserts(classes)})`;

      const inserts = [...classes];

      const sqlQuery = mysql.format(query, inserts);

      database.query(sqlQuery, (err, data, fields) => {
        if (!err) {
          output.data.teachers_list = data;
          getAssignmentsPoints();
        } else {
          output.errors = err;
        }
      });
    }

    function getAssignmentsPoints() {
      const query = `SELECT student_assignments.id as student_assignment_id, student_assignments.assignment_id, student_assignments.student_id, student_assignments.score, student_assignments.points_total, student_assignments.comments
      FROM student_assignments
      WHERE student_assignments.student_id = ?`;

      const inserts = [req.session.user_id];

      const sqlQuery = mysql.format(query, inserts);

      database.query(sqlQuery, (err, data, fields) => {
        if (!err) {
          const assignment_ids = data.map((item, index) => {
            return item.assignment_id;
          });
          getAssignmentNames(data, assignment_ids);
        } else {
          output.errors = err;
        }
      });
    }
    function getAssignmentNames(prevAssignmentData, _ids) {
      const query = `SELECT assignments.id, assignments.assignment_name, assignments.teacher_id, assignments.class_id
      FROM assignments
      WHERE assignments.id IN (${formatInserts(_ids)})`;

      const inserts = [..._ids];

      const sqlQuery = mysql.format(query, inserts);

      database.query(sqlQuery, (err, data, fields) => {
        if (!err) {
          //combine assignment data
          const finalAssignmentData = {};
          for (let index = 0; index < data.length; index++) {
            const dataRow = data[index];
            finalAssignmentData[dataRow.assignment_name] = {
              ...prevAssignmentData[index],
              class_id: dataRow.class_id,
              teacher_id: dataRow.teacher_id
            };
          }
          output.data.assignments = finalAssignmentData;
          output.success = true;
          res.json(output);
        } else {
          output.errors = err;
        }
      });
    }

    function formatInserts(array) {
      let insertString = "";
      for (let index = 0; index < array.length; index++) {
        insertString += "?";
        if (index !== array.length - 1) {
          insertString += ", ";
        }
      }
      return insertString;
    }
  });
};
