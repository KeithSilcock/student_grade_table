// const fs = require('fs');
// module.exports = (mysql, webserver, database, encrypt)=>{
//     fs.readdir(__dirname, (err, files) => {
//         if(!err) {
//             files.forEach(file => {
//                 require(`./${file}`)(mysql, webserver, database, encrypt);
//             });
//         }else{
//             console.log("There was an error adding all routes in the index.js file")
//         }
//     })
// };

module.exports = (mysql, webserver, database, encrypt, logger) => {
  require(`./get_teacher_data.js`)(mysql, webserver, database, encrypt, logger);
  require(`./get_data_for_student.js`)(
    mysql,
    webserver,
    database,
    encrypt,
    logger
  );
  require(`./add_new_assignment.js`)(
    mysql,
    webserver,
    database,
    encrypt,
    logger
  );
  require(`./delete_assignment.js`)(
    mysql,
    webserver,
    database,
    encrypt,
    logger
  );
  require(`./get_student_name.js`)(mysql, webserver, database, encrypt, logger);
  require(`./add_new_student_to_class.js`)(
    mysql,
    webserver,
    database,
    encrypt,
    logger
  );
  require(`./update_score.js`)(mysql, webserver, database, encrypt, logger);
  require(`./log_out.js`)(mysql, webserver, database, encrypt, logger);
};
