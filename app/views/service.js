var BaseView = require('./base_view');

module.exports = BaseView.extend({
  events: {
    'click': 'click'
  },
  click: function () {
    debugger;
  }
});

module.exports.id = "Service";