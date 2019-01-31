
const { nappComponent } = require('../../lib/napp');

class Chau extends nappComponent {

  constructor(n) {
    super(n);
    this.dependencies = ["listcomp"];
  }

  run() {
    super.run();
    this.log("start chau");
    this.n().stop("hola");
  }
};

module.exports = Chau;
