var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .tab-body' : 'select',
    'click .remove-2' : 'close'
  },
  preRender: function () {
    var self = this;
    var file = self.options.model;

    if (file.get('selected')) {
      self.className = 'active';
    }

    this.attributes = {
      'data-title' : this.model.attributes.name
    };
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
    this.$el.trigger('event-file-open');
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
