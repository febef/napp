
class Chau {
  constructor() {
    this.dependencies = ["hola", "listcomp"],
    this.subordinantes = []
  }

  run(napp) {
    this.log("chau");

    napp.stop("hola");
  }

  stop() {
    this.log("chau");
  };
};

module.exports = new Chau();
