var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'li',
  events: {
    'click .tab-body'   : 'select',
    'click .close-tab' : 'close'
  },
  preRender: function () {
    var file = this.options.model;
    if (file.get('selected')) {
      this.className = 'active';
    }
  },
  getTemplateData: function () {
    return this.model.toJSON();
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:name', this.render.bind(this));
    this.listenTo(this.model, 'change:selected', this.onChangeSelected.bind(this));
  },
  onChangeSelected: function (model, selected) {
    if (selected) {
      this.$el.addClass('active');
    }
    else {
      this.$el.removeClass('active');
    }
  },
  select: function (evt) {
    evt.preventDefault();
    this.model.set('selected', true);
  },
  close: function (evt) {
    // note! you cannot rely on this.model.collection to be openFiles
    // since the model belongs to two collection (dirContents, openFiles)
    // it could point to either.
    evt.preventDefault();
    this.parentView.collection.remove(this.model);
  }
});

module.exports.id = "FileTab";
