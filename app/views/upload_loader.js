var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'file-upload display-none',
  postHydrate: function () {
    var dispatch = this.app.dispatch;
    var $el = this.$el;
    this.listenTo(dispatch, 'show:upload', this.show.bind(this));
    this.listenTo(dispatch, 'hide:upload', this.hide.bind(this));
  },
  preRender: function () {
    if (!isServer) { //clientside only
      if (false) {
        this.options.fallback = true;
      }
    }
  },
  getTemplateData: function () {
    return this.options;
  },
  show: function () {
    this.$el.removeClass('display-none')
  },
  hide: function () {
    this.$el.addClass('display-none')
  }
});

module.exports.id = "UploadLoader";
