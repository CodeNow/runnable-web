var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'notify',
  modalOptions: {},
  preRender: function () {
    if (this.modalIsInBody()) {
      this.className = this.el.className;
    }
  },
  postRender: function () {
    var $body = $('body');
    if (!this.modalIsInBody()) {
      // first render
      $body.append(this.$el);
    }
  },
  modalIsInBody: function () {
    return $('body').has(this.$el).length !== 0;
  }
});

module.exports.id = "NotificationBar";
