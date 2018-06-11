module.exports = (mysql, webserver, database)=>{

    const fs = require('fs');
    // fs.readdirSync(__dirname).forEach(file => {
    //     require(`./${file}`)(mysql, webserver, database);
    //     console.log(file)
    //     console.log('successfully added all routes')
    // });
    //
    fs.readdir(__dirname, (err, files) => {
        if(!err) {
            files.forEach(file => {
                require(`./${file}`)(mysql, webserver, database);
            });
        }else{
            console.log("There was an error adding all routes in the index.js file")
        }
    })
// require('./get_student_data')(mysql, webserver, database);
};