const slashes = require("slashes");

module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/add_new_assignment", (req, res) => {
    console.log("starting to add new assignment");

    req.session;

    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
    };

    //create new assignment in assignments table
    const query = `INSERT INTO assignments (assignment_name, teacher_id, class_id) 
    VALUES(?, ?, ?)`;
    const inserts = [
      slashes.add(req.body.assignmentName),
      req.session.user_id,
      slashes.add(req.body.class_id)
    ];

    const sqlQuery = mysql.format(query, inserts);
    dataBase.query(sqlQuery, (error, data, fields) => {
      if (!error) {
        console.log("Adding new assignment: ", req.body.assignmentName);
        // output.data.class_list = data;
        output.data.assignment_id = data.insertId;

        addStudentDataToAssignment(data.insertId);
      } else {
        output.errors = error;
        output.redirect = "/login";
        res.json(output);
      }
    });

    function addStudentDataToAssignment(assignment_id) {
      const { assignmentData } = req.body;

      //format recieved data
      let queryStrings = "";
      const assignmentValues = Object.keys(assignmentData).map(
        (student_id, index) => {
          const info = assignmentData[student_id];
          queryStrings += `(?,?,?,?,?)`;
          if (index !== Object.keys(assignmentData).length - 1) {
            queryStrings += ",";
          }
          return [
            assignment_id,
            slashes.add(info.score),
            slashes.add(info.points_total),
            slashes.add(info.comments),
            slashes.add(student_id)
          ];
        }
      );

      const query = `INSERT INTO student_assignments 
      (assignment_id, score, points_total, comments, student_id) 
      VALUES ${queryStrings}`;

      //combining arrays
      const inserts = assignmentValues.reduce((prev, current) => {
        return [...prev, ...current];
      }, []);

      const sqlQuery = mysql.format(query, inserts);
      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          output.data.student_assignment_inserts = {
            id_start: data.insertID,
            numOfRows: data.affectedRows
          };
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
