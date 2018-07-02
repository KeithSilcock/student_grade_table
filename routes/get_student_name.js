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

    if (!req.session.user_id) {
      output.errors.push("not logged in");
      output.redirect = "/login";
      res.json(output);
      return;
    }

    //create new assignment in assignments table
    const query = `SELECT \`students\`.\`first_name\`,\`students\`.\`school_id\`, \`students\`.\`last_name\` 
    FROM \`students\`
    WHERE \`students\`.\`school_id\` = ?`;
    const inserts = [slashes.add(req.body.student_id)];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        output.data.name = `${data[0].first_name} ${data[0].last_name}`;
        console.log("Student name: ", output.data.name);

        output.success = true;
        res.json(output);
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
      }
    });
  });
};
