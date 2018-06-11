const slashes = require("slashes");

module.exports = function (mysql, webserver, dataBase, encrypt) {
    // ============================
    // ==== Already Logged In? ====
    // ============================
    // if so: get user info for either teacher or student
    // webserver.get( '/api/' , ( req , res ) => {
    //     console.log("checking if user already logged in...");
    //     const output = {
    //         redirect : '',
    //         success: false,
    //     };
    //
    //     if( req.session.user_id !== undefined ) {
    //         output.redirect = '/loggin';
    //         output.success=true;
    //         res.json(output);
    //     } else {
    //         output.redirect = '/';
    //         res.json(output);
    //     }
    // });

    // ====================
    // ==== Logging In ====
    // ====================
    webserver.post("/api/teacher_login", (req, res) => {
        console.log("starting teacher log-in process")
        const output = {
            success: false,
            data: [],
            errors: [],
            redirect: "",
            // sessionID: null
        };

        // ======================
        // Validating inputs=====
        // ======================
        // req.check('school_id' , 'must be valid school_id').isEmail();
        // const validationErrors = req.validationErrors();

        // if( validationErrors ) {
        //     console.log('login error');
        //     output.redirect = '/login';
        //     output.errors = 'invalid login credentials';
        //     res.json(output);
        //     res.end();
        //     return;
        // }



        let school_id;
        let password;

        if (req.body.school_id === "" || req.body.password === "") {
            output.redirect ="/loggin";
            res.send("Password or ID is incorrect");
            res.end();
            return;
        } else {
            school_id = slashes.add(req.body.school_id);
            password = slashes.add(req.body.password);
        }

        let query = `SELECT users.password, users.permissions, 
        users.id, users.first_name, users.last_name
        FROM users
        WHERE school_id = ?`;

        let inserts = [school_id];

        let mysqlQuery = mysql.format(query, inserts);

        dataBase.query(mysqlQuery, (err, data, fields) => {
            if (!err) {
                if(data.length > 0){
                    encrypt.compare(password, data[0].password, (err, compareResponse) => {
                        // console.log("Data for initial log-in: ", data);
                        req.session.name=`${data.first_name} ${data.last_name}`;
                        req.session.user_id = data[0].id;
                        getStartingInfo(data[0].permissions);
                    });
                }else{
                    output.errors = err;
                    output.redirect = "/login";
                    res.json(output)
                }
            }
        });

        function getStartingInfo(permissions) {

            // turns permissions integer into an array of bits for permissions
            // not yet implemented
            const current_permissions = (permissions).toString(2).split("").reverse();

            if(current_permissions[1] > 0){
                //they are a teacher
                getTeacherData();
            }else{
                //they are a student
                getStudentData()
            }

        }

        /*

        SELECT users.first_name as student_fn, users.last_name as student_ln,
classes.class_name, classes.description, classes.grade,
assignments.assignment_name, assignments.score, assignments.points_total
FROM users
JOIN classes ON classes.teacher_id = '3'
JOIN assignments on assignments.teacher_id = '3'
WHERE users.id IN (SELECT classes.student_id
                   FROM classes
                   WHERE classes.teacher_id = '3')


         */

        function getTeacherData(){
            //get student list:
            let query = `SELECT users.first_name as student_fn, users.last_name as student_ln, users.id as student_id
            FROM users
            WHERE users.id IN (SELECT classes.student_id
            FROM classes
            WHERE classes.teacher_id = ?)`;
            let inserts = [req.session.user_id];

            let sqlQuery = mysql.format(query, inserts);

            dataBase.query(sqlQuery, (error, data, fields) => {
                if (!error) {
                    output.student_list = data;
                    getStudentClassData()
                } else {
                    output.errors = error;
                    output.redirect = "/login";
                    res.json(output);

                }
            });

            //get all classes data
            function getStudentClassData() {
                
            }
        }

        function getStudentData(){

        }
    })
}
