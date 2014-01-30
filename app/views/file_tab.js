var BaseView = require('./base_view');

module.exports = BaseView.extend({
  events: {
    'click .tab-body'   : 'select',
    'click .close-tab' : 'close'
  },
  preRender: function () {
    var self = this;
    var opts = self.options;
    var file = opts.model;

    if (!opts.select) {
      // default tabs
      self.tagName = 'li';
    } else {
      // select menu tabs
      self.tagName = 'option';
    }

    if (file.get('selected')) {
      self.className = 'active';
    }
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:name', this.render.bind(this));
    this.listenTo(this.model, 'change:selected', this.onChangeSelected.bind(this));
  },
  postRender: function () {
  },
  onChangeSelected: function (model, selected) {
    if (selected) {
      this.$el.addClass('active').prop('selected',true);
    }
    else {
      this.$el.removeClass('active').prop('selected',false);
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
