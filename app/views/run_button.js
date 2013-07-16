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
    var windowName = this.model.id+'output';
    var popup = window.open(url, windowName);
    this.model.run(function (err) {
      if (err) {
        popup.close();
      } else {
        popup.postMessage("Refresh", "*");
      }
    });
  }
});

module.exports.id = 'RunButton';
