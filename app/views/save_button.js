var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  id: 'save-button-view',
  className: 'btn-save btn-tertiary',
  events: {
    'click' : 'saveAll'
  },
  postRender: function () {
    this.listenTo(this.collection, "unsaved", this.onChangeUnsaved.bind(this));
    this.onChangeUnsaved(this.collection.unsaved());
  },
  saveAll :function () {
    this.disable(true);
    this.collection.saveAll(function (err) {
      this.disable(false);
      this.showIfError(err);
    }, this);
  },
  onChangeUnsaved: function (bool) {
    this.disable(!bool);
  }
 });

module.exports.id = "SaveButton";
