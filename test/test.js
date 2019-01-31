
var napp = require("../lib/napp.js");
var config = {
  componentsPath: "testcomp",
  log: true
};

var app  = new napp(config);

app.run();
