module.exports = (mysql, webserver, database)=>{

    const fs = require('fs');

    fs.readdir(__dirname, (err, files) => {
        if(!err) {
            files.forEach(file => {
                require(`./${file}`)(mysql, webserver, database);
            });
        }else{
            console.log("There was an error adding all routes in the index.js file")
        }
    })
};