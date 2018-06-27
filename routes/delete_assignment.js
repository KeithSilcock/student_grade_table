const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/delete_assignment", (req, res) => {
    console.log("starting to delete assignment");

    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
    };

    //get data to make sure this is the correct teacher to delete this assignment
    const query = `SELECT assignments.teacher_id FROM assignments WHERE assignments.id=?`;
    const inserts = [slashes.add(req.body.assignment_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        // perform check to see if current teacher can delete field

        if (data[0].teacher_id === req.session.user_id) {
          deleteAssignment(slashes.add(req.body.assignment_id));
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

    function deleteAssignment(assignment_id) {
      const query = `DELETE assignments, student_assignments
      FROM assignments
      JOIN student_assignments ON assignments.id = student_assignments.assignment_id
      WHERE assignments.id = ?`;

      const inserts = [assignment_id];

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
