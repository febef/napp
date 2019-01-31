/* jslint node: true */

const fs = require('fs');
const path = require('path');

class napp {

  constructor(conf) {
    this.components = {};
    this.runOrder = [];
    this.config = conf || {componentsPath : "./componets"};
    this.log = this.loger;
  }

  reloadloger(...strs) {
    console.log("[napp] (R)", ...strs);
  }

  loger(...strs) {
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

  unloadloger(str) {
    this.log("<unloading:", str, ">");
  }

  loadComponents() {
    fs
      .readdirSync(path.join(process.env.PWD, this.config.componentsPath))
      .filter( file => file.indexOf(".") !== 0 )
      .forEach( file => {
        this.load(file.slice(-3) == ".js" ? file.slice(0, -3) : file);
      });
  }

  runComponents(components = this.components) {
    let compnames = [];
    this.runOrder = [];

    for(let i in components) if (!this.components[i].runing)
      compnames.push(i);

    const satidfyRequirements = (component) => {
      let satisdied = true;
      for (let i = 0; i < this.components[component].dependencies.length; i++)
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

    for (let i = 0; i < compnames.length; i++)
      addComponent(compnames[i]);

    for (let i = 0; i < this.runOrder.length; i++) {
      if(!this.components[this.runOrder[i]].runing) {
        if(this.config.log) this.runloger(this.runOrder[i]);
        this.components[this.runOrder[i]].runing = true;
        this.components[this.runOrder[i]].run(this);
      }
    }
  }

  stop(component) {
    if (!this.components[component].runing) return false;

    for (let i = 0; i < this.components[component].subordinantes.length; i++)
      this.stop(this.components[component].subordinantes[i]);

    this.stoploger(component);
    this.components[component].stop();
    this.components[component].runing = false;
  }

  unload(component) {
    if (typeof this.components[component] == 'undefined') return false;
    if (this.components[component].runing) this.stop(component);
    if (this.config.log) this.unloadloger(component);
    delete this.components[component];
    return true;
  }

  load(component) {
    if (this.config.log) this.loadloger(component);
    this.components[component] = require(path.join(process.env.PWD, this.config.componentsPath, component));
    this.components[component].runing = false;
    this.components[component].log = (...strs) => {this.log('{'+component+'}:',...strs);};
    this.components[component].name = component;
    this.components[component].n = () => this;
    return true;
  }

  run() {
    this.loadComponents();
    this.runComponents();
    return true;
  }

  reload(component) {
    this.log = this.reloadloger;

    let isrunning = this.components[component].runing;
    let subordinatesRunning = this.components[component].subordinantes
      .filter((c) => this.components[c].runing);

    this.unload(component);
    this.load(component);
    if (isrunning) this.runComponents({[component]: {}});

    for (let i = 0; i < subordinatesRunning.length; i++)
      this.run(subordinatesRunning[i]);

    this.log = this.loger;
    return true;
  }
};

module.exports = napp;
