exports.credentials = {
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'database',
    port: PORT
};

exports.encrypt = {
    saltRounds : bcrypt.genSaltSync( # ),
    hash: bcrypt.hash,
    compare : bcrypt.compare
};

exports.secret = {
    secret:'secret'
};