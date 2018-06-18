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
      data: {},
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

    const query = `SELECT users.password, users.permissions
        FROM users
        WHERE school_id = ?`;

    const inserts = [school_id];

    const mysqlQuery = mysql.format(query, inserts);

    dataBase.query(mysqlQuery, (err, data, fields) => {
      if (!err) {
        if (data.length > 0) {
          encrypt.compare(password, data[0].password, (err, compareResponse) => {
            req.session.name = `${data[0].first_name} ${data[0].last_name}`;
            req.session.user_id = school_id;
            getStartingInfo(data[0].permissions);
          });
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
        getTeacher_ClassData();
      } else {
        //they are a student
        getStudentData();
      }
    }

    function getTeacher_ClassData() {
      const query = `SELECT teachers.first_name, teachers.last_name, teachers.class_id, classes.class_name, classes.description
      FROM teachers
      JOIN classes ON teachers.class_id = classes.id
      WHERE teachers.school_id = ?`;
      const inserts = [req.session.user_id];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
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
    }

    function getTeacher_StudentData(class_ids) {
      // get student list:
      const query = `SELECT students.school_id, students.class_id, students.first_name, 
      students.last_name FROM students WHERE students.class_id in (?)`;
      const inserts = [class_ids];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          // output.student_list = data;
          output.data.student_list = data;

          let student_ids = data.map(student => {
            return student.school_id;
          });
          //get unique values only:
          student_ids = [...new Set(student_ids)];

          getTeacherAssignmentData(student_ids, class_ids);
        } else {
          output.errors = error;
          output.redirect = "/login";
          res.json(output);
        }
      });
    }

    //get all assignment data
    function getTeacherAssignmentData(student_ids, class_ids) {
      const query = `SELECT assignments.id, assignments.assignment_name, 
      assignments.score, assignments.points_total, assignments.comments, 
      assignments.school_id, assignments.class_id
      FROM assignments
      WHERE assignments.school_id IN (?) AND assignments.class_id IN (?)`;
      const inserts = [student_ids, class_ids];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
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

    //   function getStudentData() {}
    // });
  });
};
