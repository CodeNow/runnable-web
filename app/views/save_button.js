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
      this.disable(false);
      if (err) {
        this.showError(err);
      }
    }, this);
  },
  onChangeUnsaved: function (bool) {
    if (bool)
      this.$el.removeAttr('disabled');      
    else
      this.$el.attr('disabled','disabled');      

  }
 });

module.exports.id = "SaveButton";
