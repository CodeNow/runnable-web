var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'ul',
  className: 'nav nav-pills navbar-right',
  postHydrate: function () {
    this.listenTo(this.model, 'change:username', this.render.bind(this));
  }
});

module.exports.id = "HeaderActions";
