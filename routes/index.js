const fs = require('fs');
module.exports = (mysql, webserver, database, encrypt)=>{
    fs.readdir(__dirname, (err, files) => {
        if(!err) {
            files.forEach(file => {
                require(`./${file}`)(mysql, webserver, database, encrypt);
            });
        }else{
            console.log("There was an error adding all routes in the index.js file")
        }
    })
};