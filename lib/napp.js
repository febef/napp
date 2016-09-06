/* jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');

var napp = function(conf){

  this.components = {};
  this.runOrder = [];
  this.config = conf || {componentsPath : "./componets"};

};

napp.prototype.runloger = function(str){
  console.log("[napp] <runing:", str, ">");
};

napp.prototype.stoploger = function(str){
  console.log("[napp] <stoping", str, ">");
};

napp.prototype.loadloger = function(str){
  console.log("[napp] <loading: ", str, ">");
};

napp.prototype._loadComponents = function(){

  fs
    .readdirSync(this.config.componentsPath)
    .filter( (file) => {
      return ( file.indexOf(".") !== 0 );
    })
    .forEach( file => {
      file = (file.slice(-3)==".js") ? file.slice(0, -3) : file;
      if(this.config.log) this.loadloger(file);
      this.components[file] = require(path.join(this.config.componentsPath, file));
      this.components[file].runing = false;
    });

};

napp.prototype._runComponents = function(){

  var i, compnames = [];
  this.runOrder = [];

  for( i in this.components)
    compnames.push(i);

  var wasOrdained = (component) => {
    for(let i=0; this.runOrder.length; i++)
      if (this.runOrder[i] = component) return true;
    return false;
  };

  var satidfyRequirements = (component) => {
    let i, satisdied = true;
    for (i=0; i<this.components[component].dependencies.length; i++)
      satisdied = satisdied && addComponent(this.components[component].dependencies[i], component);
    return satisdied;
  };

  var addComponent = (component, depOf) => {
    if (depOf && this.components[component].subordinantes.indexOf(depOf)<0)
      this.components[component].subordinantes.push(depOf);
    if(this.runOrder.indexOf(component) < 0)
      if(satidfyRequirements(component))
        this.runOrder.push(component);
      else
        return false;
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
};

napp.prototype.stop = function(component){

  var i;
  if (!this.components[component].runing)
    return false;

  for (i=0; i < this.components[component].subordinantes.length; i++)
    this.stop(this.components[component].subordinantes[i]);

  this.stoploger(component);
  this.components[component].runing = false;
  this.components[component].stop();

};

napp.prototype.run = function(){

  this._loadComponents();
  this._runComponents();

};

module.exports = napp;
