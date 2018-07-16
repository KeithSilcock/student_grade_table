const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/add_student_to_class", (req, res) => {
    console.log("starting to add new assignment");

    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
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
    const query = `SELECT students.id FROM students WHERE students.school_id=? AND students.class_id=?`;
    const inserts = [
      slashes.add(req.body.school_id),
      slashes.add(req.body.class_id)
    ];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        if (data.length > 1) {
          addStudentToTable();
        } else {
          output.logMessage = "User already in class";
          res.json(output);
        }
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
      }
    });

    function addStudentToTable() {
      //create new assignment in assignments table
      const query = `INSERT INTO \`students\` (\`students\`.\`school_id\`, 
    \`students\`.\`first_name\`, \`students\`.\`last_name\`, 
    \`students\`.\`class_id\`) 
    VALUES(?,?,?,?)`;
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
