
const { nappComponent } = require('../../../lib/napp');

class Hola extends nappComponent {

  run() {
    this.log("hola");
    this.n().reload("chau");
    this.runing = true;
  }

  stop() {
    this.log("chauuuuu chicha!");
    this.runing = false;
  }
};

module.exports = Hola;
