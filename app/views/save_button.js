var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  id: 'save-button-view',
  className: 'btn-save btn-tertiary',
  events: {
    'click div' : 'saveAll'
  },
  postRender: function () {
    this.model.openFiles.on("hasUnsavedChanges", this.hasUnsavedChanges.bind(this));
    this.model.openFiles.on("noUnsavedChanges", this.noUnsavedChanges.bind(this));
  },
  saveAll :function () {
    console.log("Trying to save all");
    this.model.openFiles.saveAll(this.model.id, function (){});
  },
  hasUnsavedChanges: function () {
    this.$el.css('color', 'blue');
  },
  noUnsavedChanges: function () {
    this.$el.css('color', 'gray');
  }
 });

module.exports.id = "SaveButton";
