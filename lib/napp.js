
const fs = require('fs');
const path = require('path');

module.exports.nappComponent = class nappComponent {

  constructor(n) {
    this.subordinantes = [];
    this.dependencies = [];
    this.pd = this.dependencies.push;
    for (let p in n) this[p] = n[p];
  }

  run() {
    this.log("starting...");
    this.running = true;
  }

  stop() {
    this.log("Stoping...");
    this.running = false;
  }
};

module.exports.napp = class napp {

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
      if (!this.components[component]) component = (this.getComponent(component) || {name: ''}).name;
      for (let i = 0; i < this.components[component].dependencies.length; i++)
        satisdied = satisdied && addComponent(this.components[component].dependencies[i], component);
      return satisdied;
    };

    const addComponent = (component, depOf) => {
      if (!this.components[component]) component = (this.getComponent(component) || {name: ''}).name;
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
        this.components[this.runOrder[i]].run();
      }
    }
  }

  getComponent(type) {
    if (this.components[type]) return this.components[type];

    for (let i in this.components)
      if (this.components[i].constructor.name == type)
        return this.components[i];

  }

  stop(component) {

    if (!this.components[component]) component = (this.getComponent(component) || {name: ''}).name;
    if (!this.components[component].runing) return false;

    for (let i = 0; i < this.components[component].subordinantes.length; i++)
      this.stop(this.components[component].subordinantes[i]);

    this.stoploger(component);
    this.components[component].stop();
  }

  unload(component) {
    if (!this.components[component]) component = (this.getComponent(component) || {name: ''}).name;
    if (typeof this.components[component] == 'undefined') return false;
    if (this.components[component].runing) this.stop(component);
    if (this.config.log) this.unloadloger(component);
    delete this.components[component];
    return true;
  }

  load(component) {
    if (this.config.log) this.loadloger(component);
    this.components[component] =
      new (require(path.join(process.env.PWD, this.config.componentsPath, component)))({
        log: (...strs) => {this.log('{'+component+'}:',...strs);},
        subordinantes: [],
        dependencies: [],
        name: component,
        runing: false,
        n: () => this,
        gc: (type) => this.getComponent(type),
        gnc: (type) => this.getComponent(type).name
      });

    return true;
  }

  run() {
    this.loadComponents();
    this.runComponents();
    return true;
  }

  reload(component) {
    if (!this.components[component]) component = (this.getComponent(component) || {name: ''}).name;
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
