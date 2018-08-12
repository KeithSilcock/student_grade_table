module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      // relative path is from src
      { from: "./src/assets/favicon/favicon.ico" } // <- your path to favicon
    ])
  ]
};
