var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  id: 'save-button-view',
  className: 'btn-save btn-tertiary',
  events: {
    'click div' : 'saveAll'
  },
  postRender: function () {
    this.listenTo(this.collection, "hasUnsavedChanges", this.hasUnsavedChanges.bind(this));
    this.listenTo(this.collection, "noUnsavedChanges", this.noUnsavedChanges.bind(this));
  },
  saveAll :function () {
    console.log("Trying to save all");
    this.collection.saveAll(function (){});
  },
  hasUnsavedChanges: function () {
    this.$el.css('color', 'blue');
  },
  noUnsavedChanges: function () {
    this.$el.css('color', 'gray');
  }
 });

module.exports.id = "SaveButton";
