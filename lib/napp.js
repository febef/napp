/* jslint node: true */

const fs = require('fs');
const path = require('path');

class napp {

  constructor(conf) {
    this.components = {};
    this.runOrder = [];
    this.config = conf || {componentsPath : "./componets"};
  }

  log(...strs) {
    console.log("[napp]", ...strs);
  }

  runloger(str) {
    this.log("<runing:", str, ">");
  }

  stoploger(str) {
      this.log("<stoping:", str, ">");
  }

  loadloger(str) {
    this.log("<loading:", str, ">");
  }

  loadComponents() {

    fs
      .readdirSync(path.join(process.env.PWD, this.config.componentsPath))
      .filter( file => file.indexOf(".") !== 0 )
      .forEach( file => {
        file = (file.slice(-3) == ".js") ? file.slice(0, -3) : file;
        if (this.config.log) this.loadloger(file);
        this.components[file] = require(path.join(process.env.PWD, this.config.componentsPath, file));
        this.components[file].runing = false;
        this.components[file].log = (...strs) => {this.log('{'+file+'}:',...strs);};
        this.components[file].name = file;
        this.components[file].n = () => this;
      });
  }

  runComponents() {

    let i, compnames = [];
    this.runOrder = [];

    for( i in this.components)
      compnames.push(i);

    const satidfyRequirements = (component) => {
      let i, satisdied = true;
      for (i=0; i<this.components[component].dependencies.length; i++)
        satisdied = satisdied && addComponent(this.components[component].dependencies[i], component);
      return satisdied;
    };

    const addComponent = (component, depOf) => {
      if (depOf && this.components[component].subordinantes.indexOf(depOf)<0)
        this.components[component].subordinantes.push(depOf);
      if(this.runOrder.indexOf(component) < 0)
        if(satidfyRequirements(component))
          this.runOrder.push(component);
        else
          return false;
      return true;
    };

    for (i=0; i<compnames.length; i++)
      addComponent(compnames[i]);

    for (i=0; i<this.runOrder.length; i++){
      if(this.config.log) this.runloger(this.runOrder[i]);
      this.components[this.runOrder[i]].runing = true;
      this.components[this.runOrder[i]].run(this);
    }
  }

  stop(component) {
    let i;
    if (!this.components[component].runing) return false;

    for (i=0; i < this.components[component].subordinantes.length; i++)
      this.stop(this.components[component].subordinantes[i]);

    this.stoploger(component);
    this.components[component].runing = false;
    this.components[component].stop();
  }

  run(){
    this.loadComponents();
    this.runComponents();
  }
};

module.exports = napp;
