module.exports = function(mysql, webserver, dataBase, encrypt, logger) {
  webserver.get("/api/get_teacher_data", (req, res) => {
    const output = {
      success: false,
      data: {},
      redirect: ""
    };

    if (
      !req.session.user_id ||
      typeof req.session.permissions[1] === "undefined" ||
      req.session.permissions[1] < 1
    ) {
      logger.simpleLog(__filename, req, null, "User Not Logged In");
      res.json(output);
      return;
    }

    const query = [
      "SELECT `teachers`.`first_name`, `teachers`.`last_name`, `teachers`.`class_id`, `classes`.`class_name`, `classes`.`description`",
      "FROM `teachers`",
      "JOIN `classes` ON `teachers`.`class_id` = `classes`.`id`",
      "WHERE `teachers`.`school_id` = ?"
    ].join(" ");
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
        logger.simpleLog(__filename, req, error);
        res.json(output);
      }
    });

    function getTeacher_StudentData(class_ids) {
      // get student list:
      const query = [
        "SELECT `students`.`school_id`, `students`.`class_id`, `students`.`first_name`,",
        "`students`.`last_name` FROM `students` WHERE `students`.`class_id` in (?)"
      ].join(" ");
      const inserts = [class_ids];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          output.data.student_list = data;

          let student_ids = data.map(student => {
            return student.school_id;
          });
          //get unique values only:
          student_ids = [...new Set(student_ids)];

          getTeacherAssignmentData();
        } else {
          logger.simpleLog(__filename, req, error);
          res.json(output);
        }
      });
    }

    //get all assignment data
    function getTeacherAssignmentData() {
      const query = [
        "SELECT `assignments`.`id` as assignment_id, `assignments`.`class_id`, `assignments`.`assignment_name`,",
        "`student_assignments`.`student_id`, `student_assignments`.`score`, `student_assignments`.`points_total`,",
        "`student_assignments`.`comments`, `student_assignments`.`id` as student_assignment_id",
        "FROM `assignments`",
        "JOIN `student_assignments` ON `assignments`.`id` = `student_assignments`.`assignment_id`",
        "WHERE `assignments`.`teacher_id` = ?"
      ].join(" ");
      const inserts = [req.session.user_id];

      const sqlQuery = mysql.format(query, inserts);

      dataBase.query(sqlQuery, (error, data, fields) => {
        if (!error) {
          output.data.assignment_list = data;
          output.success = true;

          res.json(output);
        } else {
          logger.simpleLog(__filename, req, error);
          res.json(output);
        }
      });
    }
  });
};
