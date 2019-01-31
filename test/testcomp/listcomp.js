
const { nappComponent } = require('../../lib/napp');

class ListComp extends nappComponent {

  constructor(n) {
    super(n);
    this.dependencies.push('hola');
  }

  run() {
    super.run();
    this.log(JSON.stringify(this.n().components));
  }

};

module.exports = ListComp;
