
var napp = require("../lib/napp.js");
var config = {
  componentsPath: __dirname + "/testcomp",
  log: true
};

var app  = new napp(config);

app.run();
