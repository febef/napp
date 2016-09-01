



var run = function(napp){
  console.log("chau\n");

  napp.stop("hola");
};

var stop = function () {
  console.log("chau\n");
};

module.exports = {
  run: run,
  stop: stop,
  dependencies: ["hola", "listcomp"],
  subordinantes: []
};
