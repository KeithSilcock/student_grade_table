module.exports = (mysql, webserver, database) => {
  webserver.get("/api/get_data_for_student", (req, res) => {
    console.log("Getting individual student data");

    const output = {
      success: false,
      data: [],
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
        const classes = data.map((student, index) => {
          return student.class_id;
        });
        getClasses(classes);
      } else {
        output.errors = err;
      }
    });

    function getClasses(classes) {
      const query = `SELECT students.first_name, students.last_name, students.class_id
        FROM students
        WHERE students.school_id='abc123'`;

      const inserts = [req.session.user_id];

      const sqlQuery = mysql.format(query, inserts);

      database.query(sqlQuery, (err, data, fields) => {
        if (!err) {
          output.data.name = `${data[0].first_name} ${data[0].last_name}`;
          const classes = data.map((student, index) => {
            return student.class_id;
          });

          res.json(output);
        } else {
          output.errors = err;
        }
      });
    }
  });
};
