module.exports = (mysql, webserver, database) => {

    webserver.get('/api/get_student_data', (req, res) =>{
        console.log('someone has reached our endpoint')
        const output = {
            success: false,
            data: [],
            errors: [],
        };

        let query = `SELECT users.first_name, users.last_name, classes.class_name, classes.grade
        FROM users
        JOIN classes where users.id = classes.student_id`;

        database.query(query, (err, data, fields) => {
            if(!err){
                console.log("query sucessful");
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