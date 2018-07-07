const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/update_score", (req, res) => {
    console.log("starting update score procedure");

    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
    };

    if (!req.session.user_id) {
      output.errors.push("not logged in");
      output.redirect = "/login";
      res.json(output);
    }
    const clean_assignment_id = slashes.add(req.body.assignment_id);
    const clean_student_assignment_id = slashes.add(
      req.body.student_assignment_id
    );
    const clean_column_name = slashes.add(req.body.column_name);
    const clean_column_value = slashes.add(req.body.column_value);

    //get data to make sure this is the correct teacher to delete this assignment
    const query = `SELECT assignments.teacher_id FROM assignments WHERE assignments.id=?`;
    const inserts = [clean_assignment_id];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        // perform check to see if current teacher change score

        if (data[0].teacher_id === req.session.user_id) {
          changeScore();
        } else {
          output.errors = "Incorrect user."; // log this as is likely someone nefarious
          output.redirect = "/login";
          res.json(output);
        }
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
      }
    });

    function changeScore() {
      const query = `UPDATE student_assignments 
      SET ??=?
      WHERE student_assignments.id=?`;

      const inserts = [
        clean_column_name,
        clean_column_value,
        clean_student_assignment_id
      ];

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
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
