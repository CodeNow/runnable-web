var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'run-button btn-primary',
  events: {
    'click' : 'click'
  },
  click: function () {
    var url = '/'+this.model.id+'/output';
    window.open(url, '_blank')
  }
});

module.exports.id = 'RunButton';
