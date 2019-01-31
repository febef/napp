
class ListComp {
  constructor() {
    this.dependencies = [];
    this.subordinantes = [];
  }

  run(napp) {
    this.log("\n",JSON.stringify(napp.components),"\n");
  }

  stop() {
    this.log("chau\n");
  }
};

module.exports = new ListComp();
