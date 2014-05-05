var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'rebuild-loader',
  className: 'with-text',
  events: {
    'click a' : 'cancel'
  },
  cancel: function () {
    $('#project').removeClass('out');
  }
});

module.exports.id = "RebuildLoader";
