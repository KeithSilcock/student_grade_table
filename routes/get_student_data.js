module.exports = (mysql, webserver, database) => {
  webserver.get("/api/get_student_data", (req, res) => {
    console.log("someone has reached our endpoint");

    const output = {
      success: false,
      data: [],
      errors: []
    };

    if (
      !req.session.user_id ||
      typeof req.session.permissions[1] === "undefined" ||
      req.session.permissions[1] < 1
    ) {
      output.errors.push("not logged in");
      output.redirect = "/login";
      res.json(output);
      return;
    }

    const query = `SELECT users.first_name, users.last_name, classes.class_name, classes.grade
        FROM users
        JOIN classes ON users.id = classes.student_id
        WHERE users.id = ?`;

    const inserts = ["1"];

    const sqlQuery = mysql.format(query, inserts);

    database.query(sqlQuery, (err, data, fields) => {
      if (!err) {
        console.log("query sucessful");
        output.success = true;
        output.data = data;
        output.message = "Query was successful";
      } else {
        output.errors = err;
      }

      res.json(output);
    });
  });
};
