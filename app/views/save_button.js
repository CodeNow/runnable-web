var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  id: 'save-button-view',
  className: 'btn-save btn-tertiary',
  events: {
    'click div' : 'saveAll'
  },
  postRender: function () {
    this.listenTo(this.collection, "unsaved", this.onChangeUnsaved.bind(this));
  },
  saveAll :function () {
    this.disable(true);
    this.collection.saveAll(function (err) {
      if (err) {
        this.showError(err);
      }
    }, this);
  },
  onChangeUnsaved: function (bool) {
    if (bool)
      this.$el.css('color', 'blue');
    else
      this.$el.css('color', 'gray');
  }
 });

module.exports.id = "SaveButton";
