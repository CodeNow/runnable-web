var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;

module.exports = EditorButtonView.extend({
  tagName: 'button',
  id: 'save-button-view',
  className: 'silver',
  events: {
    'click' : 'saveAll'
  },
  preRender: function () {
    Super.preRender.call(this);
  },
  postHydrate: function () {
    Super.postHydrate.call(this);
  },
  postRender: function () {
    this.listenTo(this.collection, "unsaved", this.onChangeUnsaved.bind(this));
    this.app.dispatch.on('trigger:titleChange', this.onChangeUnsaved, this);
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
