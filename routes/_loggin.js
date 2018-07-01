const slashes = require("slashes");
const getTeacherData = require("./get_teacher_data.js");

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
      console.log("Reached user loggin query");
      if (!err) {
        if (data.length > 0) {
          encrypt.compare(
            password,
            data[0].password,
            (err, compareResponse) => {
              req.session.name = `${data[0].first_name} ${data[0].last_name}`;
              req.session.user_id = school_id;
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
        output.data.permissions = 1;
        output.success = true;
        res.json(output);
      } else {
        //they are a student
        output.permissions = 0;
        res.json(output);
        // getStudentData();
      }
    }

    //   function getStudentData() {}
    // });
  });
};
