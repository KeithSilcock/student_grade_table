module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.get("/api/get_teacher_data", (req, res) => {
    console.log("starting teacher teacher data retrieval  process");
    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
    };

    if (!req.session.user_id) {
      output.errors.push("not logged in");
      output.redirect = "/login";
      res.json(output);
      return;
    }

    const query = `SELECT teachers.first_name, teachers.last_name, teachers.class_id, classes.class_name, classes.description
    FROM teachers
    JOIN classes ON teachers.class_id = classes.id
    WHERE teachers.school_id = ?`;
    const inserts = [req.session.user_id];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      console.log("Reached teacher class data query");
      if (!error) {
        output.data.class_list = data;
        const class_ids = data.map(item => {
          return item.class_id;
        });
        getTeacher_StudentData(class_ids);
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
      }
    });

    function getTeacher_StudentData(class_ids) {
      // get student list:
      const query = `SELECT students.school_id, students.class_id, students.first_name, 
    students.last_name FROM students WHERE students.class_id in (?)`;
      const inserts = [class_ids];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
        console.log("Reached teacher-student data query");
        if (!error) {
          // output.student_list = data;
          output.data.student_list = data;

          let student_ids = data.map(student => {
            return student.school_id;
          });
          //get unique values only:
          student_ids = [...new Set(student_ids)];

          getTeacherAssignmentData();
        } else {
          output.errors = error;
          output.redirect = "/login";
          res.json(output);
        }
      });
    }

    //get all assignment data
    function getTeacherAssignmentData() {
      const query = `SELECT assignments.id as assignment_id, assignments.class_id, assignments.assignment_name, 
    student_assignments.student_id, student_assignments.score, student_assignments.points_total, 
    student_assignments.comments, student_assignments.id as student_assignment_id
    FROM assignments
    JOIN student_assignments ON assignments.id = student_assignments.assignment_id
    WHERE assignments.teacher_id = ?`;
      const inserts = [req.session.user_id];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
        console.log("Reached teacher assignment data query");
        if (!error) {
          output.data.assignment_list = data;
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
