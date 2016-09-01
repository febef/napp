/* jslint node: true */
"use strict";


var fs = require('fs');
var path = require('path');


var components = {};
var runOrder = [];
var config = {};

var napp = function(conf){

  this.components = components;
  this.runOrder = runOrder;
  config = conf;
  this.config = config;

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
    .readdirSync(config.componentsPath)
    .filter( (file) => {
      return (
        file.indexOf(".") !== 0 &&
        file.slice(-3)    === ".js"
      );
    })
    .forEach( file => {
      if(config.log) this.loadloger(file);
      components[file.slice(0, -3)] = require(path.join(config.componentsPath, file));
    });

};

napp.prototype._runComponents = function(){

  var i, compnames = [];


  runOrder = [];

  for( i in components)
    compnames.push(i);

  var wasOrdained = (component) => {
    for(let i=0; runOrder.length; i++)
      if (runOrder[i] = component) return true;
    return false;
  };

  var satidfyRequirements = (component) => {
    let i, satisdied = true;
    for (i=0; i<components[component].dependencies.length; i++)
      satisdied = satisdied && addComponent(components[component].dependencies[i], component);
    return satisdied;
  };

  var addComponent = (component, depOf) => {
    if (depOf && components[component].subordinantes.indexOf(depOf)<0)
      components[component].subordinantes.push(depOf);
    if(runOrder.indexOf(component) < 0)
      if(satidfyRequirements(component))
        runOrder.push(component);
      else
        return false;
    else
      return false;
    return true;
  };

  for (i=0; i<compnames.length; i++)
    addComponent(compnames[i]);

  for (i=0; i<runOrder.length; i++){
    if(config.log) this.runloger(runOrder[i]);
    components[runOrder[i]].runed = true;
    components[runOrder[i]].run(this);
  }
};

napp.prototype.stop = function(component){

  var i;
  if (!components[component].runed)
    return false;

  for (i=0; i < components[component].subordinantes.length; i++)
    this.stop(components[component].subordinantes[i]);

  this.stoploger(component);
  components[component].runed = false;
  components[component].stop();

};

napp.prototype.run = function(){

  this._loadComponents();
  this._runComponents();

};

module.exports = napp;
