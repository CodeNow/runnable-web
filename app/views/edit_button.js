var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-tertiary',
  events: {
    'click': 'openContainerPage'
  },
  openContainerPage: function () {
    // in the future we may want to open a new container and not this one
    window.location.href = '/me/'+this.options.containerid;
  }
});

module.exports.id = 'EditButton';
