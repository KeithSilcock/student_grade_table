module.exports = function(mysql, webserver, dataBase, encrypt) {
  webserver.post("/api/add_new_assignment", (req, res) => {
    console.log("starting teacher log-in process");
    const output = {
      success: false,
      data: {},
      errors: [],
      redirect: ""
      // sessionID: null
    };
  });
};
