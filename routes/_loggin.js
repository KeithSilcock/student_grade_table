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
        // console.log("starting log-in process")
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

        // console.log('school_id and pass', school_id, password)
        // Pull school_id data to compare to password

        let query = `SELECT users.password
            FROM users
            WHERE school_id = ?`;

        let inserts = [school_id];

        let mysqlQuery = mysql.format(query, inserts);

        dataBase.query(mysqlQuery, (err, data, fields) => {
            if (!err) {
                if(data.length > 0){
                    encrypt.compare(password, data[0].password, (err, compareResponse) => {
                        // console.log("comparing password...")
                        password = data[0].password;
                        let query = `SELECT 
                        users.user_id, 
                        athlete_info.athlete_info_id, 
                        athletes.team_id,
                        athletes.athlete_id,
                        athlete_info.first_name, 
                        athlete_info.last_name,
                        teams.team_code,
                        teams.team_name
                            FROM users
                            JOIN athlete_info
                                ON users.user_id = athlete_info.user_id
                            JOIN athletes
                                ON athlete_info.athlete_info_id = athletes.athlete_info_id
                            JOIN teams
                                ON athletes.team_id = teams.team_id
                            WHERE school_id = ? 
                            AND password = ?`;

                        let inserts = [school_id, password];

                        let sqlQuery = mysql.format(query, inserts);

                        dataBase.query(sqlQuery, (error, data, fields) => {
                            if (!error) {
                                // tried to go to page without logging in
                                if (data.length === 0) {
                                    output.redirect = "/login";
                                    output.errors = "Invalid Login Credentials";
                                    res.json(output);
                                    return;
                                }

                                // providing data if user logged in
                                output.success = true;
                                output.data = data;
                                // console.log(data);
                                output.redirect = "/bulletin_board";

                                req.session.user_id = data[0].user_id;
                                req.session.team_id = data[0].team_id;
                                req.session.team_code = data[0].team_code;
                                req.session.athlete_id = data[0].athlete_id;
                                req.session.athlete_info_id = data[0].athlete_info_id;
                                // console.log("User Logged in and session data has been stored")
                                // send back json data about path they should go to (bulletinboard) => browser history
                                res.json(output);
                            } else {
                                output.errors = error;
                            }
                        });
                    });
                }else{
                    output.redirect = "/login";
                    res.json(output)
                }
            }
        });
    });
};
