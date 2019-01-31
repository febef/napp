
const { napp } = require('../lib/napp');
const config   = { componentsPath: "testcomp", log: true };
const app      = new napp(config);

app.run();
