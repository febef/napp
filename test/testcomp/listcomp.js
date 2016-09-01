



var run = function(napp){
  console.log("\n",JSON.stringify(napp.components),"\n");
};

var stop = function () {
  console.log("chau\n");
};

module.exports = {
  run: run,
  stop: stop,
  dependencies: [],
  subordinantes: []
};
