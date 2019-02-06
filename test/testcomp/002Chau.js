
const { nappComponent } = require('../../lib/napp');

class Chau extends nappComponent {

  constructor(n) {
    super(n);
    this.dependencies.push(
      'ListComp'
    );
    this.text = "texto de chau :P";
  }

  run() {
    super.run();
    this.log("start chau");
    this.n().stop("Hola");
  }
};

module.exports = Chau;
