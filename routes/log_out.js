module.exports = (mysql, webserver, dataBase, encrypt, logger) => {
  webserver.get("/api/logout", (req, res) => {
    const output = {
      success: false,
      redirect: "",
      error: null
    };
    req.session.destroy(error => {
      if (!error) {
        output.redirect = "/";
        output.success = true;
        res.json(output);
      } else {
        logger.simpleLog(__filename, req, error, "User Not Logged In");
        res.json(output);
      }
    });
  });
};
