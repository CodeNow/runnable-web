var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'page-loader',
  postHydrate: function () {
    this.listenTo(this.app, 'change:loading', this.loader.bind(this));
    this.loader(this.app, this.app.get('loading'));
  },
  loader: function (model, loading) {
    var $el = this.$el;
    this.loading(loading);
  }
});

module.exports.id = "PageLoader";
