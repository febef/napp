

class Hola {
  constructor() {
    this.dependencies = [];
    this.subordinantes = [];
  }

  run() {
    this.log("hola");
  }

  stop() {
    this.log("chauuuuu chicha!");
  }
};

module.exports = new Hola();
