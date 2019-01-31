debugger; 
const nApp = require('../lib/napp.js');

const config = {
  componentsPath: "testcomp",
  log: true
};

const app = new nApp(config);

app.run();
