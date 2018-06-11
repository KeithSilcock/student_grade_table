module.exports = (mysql, webserver, database) => {

    webserver.get('/api/get_student_assignments', (req, res) =>{
        console.log('someone hit the student assignments endpoint');

        const output = {
            success: false,
            data: [],
            errors: [],
        };

        const query = `SELECT classes.teacher_id, users.first_name AS teacher_first_name, 
         users.last_name AS teacher_last_name, classes.class_name, classes.grade, 
         assignments.id AS assignment_id, assignments.assignment_name, assignments.score, 
         assignments.points_total, assignments.comments 
         FROM assignments 
         JOIN classes ON assignments.class_id = classes.id 
         LEFT JOIN users ON users.id = classes.teacher_id 
         WHERE assignments.student_id = ?`;
        const inserts = ['1']; // get student id

        const sqlQuery = mysql.format(query, inserts);


        database.query(sqlQuery, (err, data, fields) => {
            if(!err){
                console.log("get_student_assignments query sucessful");
                output.success=true;
                output.data=data;
                output.message = 'Query was successful';
            }else{
                output.errors= err;
            }


            res.json(output);

        })

    })

}