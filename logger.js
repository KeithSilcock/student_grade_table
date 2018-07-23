const fs = require("fs");

function getFormattedDate() {
  var date = new Date();
  var str =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  return str;
}

function stringifyWithCircularStringifyError(string) {
  var cache = [];
  text = JSON.stringify(string, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        try {
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          return;
        }
      }
      cache.push(value);
    }
    return value;
  });
  cache = null;
  return text;
}

module.exports.simpleLog = function(file, req, errors, message) {
  const dateToLog = `${getFormattedDate()}`;
  var reqToText = "";
  var loc = "";
  var errs = "";
  var mess = "";
  if (file) {
    loc = file;
  }
  if (req) {
    reqToText = stringifyWithCircularStringifyError(req);
  }
  if (errors) {
    errs = stringifyWithCircularStringifyError(errors);
  }
  if (message) {
    mess = message;
  }

  fs.appendFile(
    `${__dirname}/logs.txt`,
    `${dateToLog}\n ${loc}\n ${mess}\n ${errs}\n ${reqToText}\n\n`,
    err => {
      if (err) throw err;
      console.log("Log Updated");
    }
  );
};
