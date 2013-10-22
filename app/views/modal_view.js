var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'modal fade',
  modalOptions: {},
  preRender: function () {
    if (this.modalIsInBody()) {
      this.className = this.el.className;
    }
  },
  postRender: function () {
    if (!this.modalIsInBody()) {
      // first render
      $('body').append(this.$el);
      this.$el.modal(this.modalOptions);
      this.$el.modal('show');
      this.$el.once('hidden.bs.modal', this.remove.bind(this));
    }
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
    this.trigger('close');
    this.$el.modal('hide');
  },
  modalIsInBody: function () {
    return $('body').has(this.$el).length !== 0;
  }
});

module.exports.id = "ModalView";
