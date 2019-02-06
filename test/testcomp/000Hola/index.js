
const { nappComponent } = require('../../../lib/napp');

class Hola extends nappComponent {

  run() {
    this.log("hola");
    this.log("text:", this.gc('002Chau').text);
    this.n().reload("Chau");
    this.runing = true;
  }

  stop() {
    this.log("chauuuuu chicha!");
    this.runing = false;
  }
};

module.exports = Hola;
