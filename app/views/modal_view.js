var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'modal fade',
  modalOptions: {},
  auto: true,
  postRender: function () {
    debugger;
    // if (!this.$el.parent().is('body')) { // needs to be direct child of
      // first render
      // $('body').append(this.$el);
      this.$el.modal(this.modalOptions);
      if (this.auto) this.$el.once('hidden.bs.modal', this.remove.bind(this));
    // }
    if (this.auto) this.$el.modal('show');
    // this.$('input').eq(0).focus();
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
