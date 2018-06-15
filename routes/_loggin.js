const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  // ============================
  // ==== Already Logged In? ====
  // ============================
  // if so: get user info for either teacher or student
  // webserver.get( '/api/' , ( req , res ) => {
  //     console.log("checking if user already logged in...");
  //     const output = {
  //         redirect : '',
  //         success: false,
  //     };
  //
  //     if( req.session.user_id !== undefined ) {
  //         output.redirect = '/loggin';
  //         output.success=true;
  //         res.json(output);
  //     } else {
  //         output.redirect = '/';
  //         res.json(output);
  //     }
  // });

  // ====================
  // ==== Logging In ====
  // ====================
  webserver.post("/api/teacher_login", (req, res) => {
    console.log("starting teacher log-in process");
    const output = {
      success: false,
      data: [],
      errors: [],
      redirect: ""
      // sessionID: null
    };

    // ======================
    // Validating inputs=====
    // ======================
    // req.check('school_id' , 'must be valid school_id').isEmail();
    // const validationErrors = req.validationErrors();

    // if( validationErrors ) {
    //     console.log('login error');
    //     output.redirect = '/login';
    //     output.errors = 'invalid login credentials';
    //     res.json(output);
    //     res.end();
    //     return;
    // }

    let school_id;
    let password;

    if (req.body.school_id === "" || req.body.password === "") {
      output.redirect = "/loggin";
      res.send("Password or ID is incorrect");
      res.end();
      return;
    } else {
      school_id = slashes.add(req.body.school_id);
      password = slashes.add(req.body.password);
    }

    const query = `SELECT users.password, users.permissions, 
        users.id, users.first_name, users.last_name
        FROM users
        WHERE school_id = ?`;

    const inserts = [school_id];

    const mysqlQuery = mysql.format(query, inserts);

    dataBase.query(mysqlQuery, (err, data, fields) => {
      if (!err) {
        if (data.length > 0) {
          encrypt.compare(
            password,
            data[0].password,
            (err, compareResponse) => {
              // console.log("Data for initial log-in: ", data);
              req.session.name = `${data[0].first_name} ${data[0].last_name}`;
              req.session.user_id = data[0].id;
              getStartingInfo(data[0].permissions);
            }
          );
        } else {
          output.errors = err;
          output.redirect = "/login";
          res.json(output);
        }
      }
    });

    function getStartingInfo(permissions) {
      // turns permissions integer into an array of bits for permissions
      // not yet implemented
      const current_permissions = permissions
        .toString(2)
        .split("")
        .reverse();

      if (current_permissions[1] > 0) {
        //they are a teacher
        getTeacherData();
      } else {
        //they are a student
        getStudentData();
      }
    }

    function getTeacherData() {
      //get student list:
      const query = `SELECT users.first_name as student_fn, users.last_name as student_ln, users.id as student_id
            FROM users
            WHERE users.id IN (SELECT classes.student_id
            FROM classes
            WHERE classes.teacher_id = ?)`;
      const inserts = [req.session.user_id];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          output.student_list = data;
          getStudentClassData();
        } else {
          output.errors = error;
          output.redirect = "/login";
          res.json(output);
        }
      });

      //get all classes data
      function getStudentClassData() {
        const query = `SELECT classes.class_name, classes.description, classes.student_id, classes.id as class_id
                FROM classes
                WHERE classes.teacher_id = ?`;
        const inserts = [req.session.user_id];
        const sqlQuery = mysql.format(query, inserts);
        dataBase.query(sqlQuery, (error, data, fields) => {
          if (!error) {
            // compile class data and student name data into one output
            const newStudentList = data.map((classInfo, index) => {
              for (
                let studentIndex = 0;
                studentIndex < output.student_list.length;
                studentIndex++
              ) {
                const student = output.student_list[studentIndex];
                if (student.student_id === classInfo.student_id) {
                  return {
                    ...classInfo,
                    first_name: student.student_fn,
                    last_name: student.student_ln,
                    assignments: []
                  };
                }
              }
            });

            output.student_list = newStudentList;
            // console.log("student list as of class query", output.student_list)
            getStudentAssignmentData();
          } else {
            output.errors = error;
            output.redirect = "/login";
            res.json(output);
          }
        });
      }
      //get all assignment data
      function getStudentAssignmentData() {
        const query = `SELECT assignments.assignment_name, assignments.score, assignments.points_total, 
                assignments.class_id, assignments.comments, assignments.student_id as student_assignment_id
                FROM assignments
                WHERE assignments.teacher_id = ?`;
        const inserts = [req.session.user_id];
        const sqlQuery = mysql.format(query, inserts);
        dataBase.query(sqlQuery, (error, data, fields) => {
          if (!error) {
            const newStudentList = output.student_list.map(
              (classInfo, index) => {
                const assignmentsArray = [];
                for (
                  let assignmentIndex = 0;
                  assignmentIndex < data.length;
                  assignmentIndex++
                ) {
                  const assignment = data[assignmentIndex];
                  if (
                    classInfo.student_id === assignment.student_assignment_id &&
                    classInfo.class_id === assignment.class_id
                  ) {
                    assignmentsArray.push(assignment);
                  }
                }
                if (assignmentsArray.length) {
                  return {
                    ...classInfo,
                    assignments: assignmentsArray
                  };
                }

                return {
                  ...classInfo
                };
              }
            );
            output.student_list = newStudentList;
            output.success = true;
            res.json(output);
          } else {
            output.errors = error;
            output.redirect = "/login";
            res.json(output);
          }
        });
      }
    }

    function getStudentData() {}
  });
};
