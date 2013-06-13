var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'section',
  className: 'notification warning',
  events: {
    'click button' : 'publish'
  },
  publish: function () {
    // project publish
    // this.model.publish
  }
});

module.exports.id = 'PublishWarningView';
