const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/get_student_name", (req, res, next) => {
    console.log("Getting data on student name");

    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
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

    //create new assignment in assignments table
    const query = `SELECT \`users\`.\`first_name\`, \`users\`.\`last_name\`
    FROM \`users\`
    WHERE \`users\`.\`school_id\`=?`;
    const inserts = [slashes.add(req.body.student_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        if (data.length) {
          output.data.first_name = data[0].first_name;
          output.data.last_name = data[0].last_name;
          console.log("Student name: ", data[0].first_name, data[0].last_name);

          output.success = true;
          res.json(output);
        } else {
          output.data.first_name = "<not found>";
          res.json(output);
          return;
        }
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
      }
    });
  });
};
