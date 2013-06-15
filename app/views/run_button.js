var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'run-button btn-primary',
  postInitialize: function () {
    b2 = this;
  },
  postRender: function () {
    tj2 = this;
  }
});

module.exports.id = 'RunButton';
