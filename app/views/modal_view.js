var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'modal fade in',
  modalOptions: {},
  preRender: function () {
    if (this.modalIsInBody()) {
      this.className = this.el.className;
    }
  },
  postRender: function () {
    if (!this.modalIsInBody()) {
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
  },
  modalIsInBody: function () {
    return $('body').has(this.$el).length !== 0;
  }
});

module.exports.id = "ModalView";
