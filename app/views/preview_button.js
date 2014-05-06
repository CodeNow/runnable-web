var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'purple',
  events: {
    'click' : 'enterPreview'
  },
  enterPreview: function () {
    // preview needs to be rebuilt, show loader
    $('#project').addClass('out');
  }
});

module.exports.id = "PreviewButton";
