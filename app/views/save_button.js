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
    console.log("Trying to save all");
    this.collection.saveAll(function (){});
  },
  onChangeUnsaved: function (bool) {
    if (bool)
      this.$el.css('color', 'blue');
    else
      this.$el.css('color', 'gray');
  }
 });

module.exports.id = "SaveButton";
