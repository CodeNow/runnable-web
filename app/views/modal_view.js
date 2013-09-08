var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'modal fade',
  modalOptions: {},
  postRender: function () {
    if ($('body').has(this.$el).length === 0) {
      // first render
      $('body').append(this.$el);
      this.$el.modal(this.modalOptions);
      this.$el.modal('show');
      this.$el.once('hidden.bs.modal', this.remove.bind(this));
    }
    this.$('input').eq(0).focus();
  },
  remove: function () {
    this.trigger('remove');
    Super.remove.apply(this, arguments);
  },
  open: function () {
    this.render();
  },
  close: function () {
    this.$el.modal('hide');
  }
});

module.exports.id = "ModalView";
