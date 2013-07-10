var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'run-button btn-primary',
  events: {
    'click' : 'click'
  },
  postRender: function () {
    console.log("CONTAINER ID: ", this.model.id);
  },
  click: function () {
    var url = '/'+this.model.id+'/output';
    var self = this;
    this.model.run(function (err) {
      if (!err) {
        var windowName = this.model.id+'output';
        window.open(url, windowName);
      }
    });
  }
});

module.exports.id = 'RunButton';
