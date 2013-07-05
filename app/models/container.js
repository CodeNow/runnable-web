var Runnable = require('./runnable');
var FileCollection = require('../collections/files');
var DirModel = require('./dir');
var _ = require('underscore');
var Super = Runnable.prototype;

module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  initialize: function (model, options) {
    Super.initialize.apply(this, arguments);
    var self = this;
    // Initialize openFiles and rootDir
    this.openFiles = new FileCollection(null, {
      container:this,
      app:this.app
    });
    this.rootDir = new DirModel({
        path:'/',
        name:"",
        dir:true
      }, {
        container:this,
        silent:true,
        app:this.app
    });
  },
  // virtuals: function () {
  //   var virtuals = _.clone(_.result(Super, 'virtuals'));
  //   return _.extend(virtuals, {});
  // }
});

module.exports.id = "Container";