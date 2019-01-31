

class Hola {
  constructor() {
    this.dependencies = ['listcomp'];
    this.subordinantes = [];
  }

  run(napp) {
    this.log("hola");
    napp.reload("chau");

  }

  stop() {
    this.log("chauuuuu chicha!");
  }
};

module.exports = new Hola();
