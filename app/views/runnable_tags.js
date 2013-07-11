var BaseView = require('./base_view');
var BaseCollection = require('../collections/base');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'tags-nav',
  events: {
    'click .remove-tag' : 'removeTag',
  },
  postHydrate: function () {
    this.collection = new BaseCollection(this.model.get('tags'), {
      app: this.app,
      url: '/users/me/runnables/'+this.model.id+'/tags'
    });
    this.listenTo(this.collection, 'add remove reset', this.render.bind(this));
    this.listenTo(this.model, 'change:tags', this.onChange.bind(this));
    this.$('img').on('error', this.missingImage.bind(this));
  },
  missingImage: function (evt) {
    debugger;
    $(evt.currentTarget).hide();
  },
  onChange: function () {
    this.collection.reset(this.model.get('tags'));
  },
  removeTag: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var tagId = $(evt.currentTarget).data('id');
    var options = utils.successErrorToCB(destroyCallback.bind(this));
    var tag = this.collection.get(tagId);
    tag.destroy(options);
    function destroyCallback (err) {
      if (err) {
        this.showError(err);
        this.collection.add(tag);
      }
    }
  },
  postRender: function () {
    this.$('img').on('error', function (evt) {
      $(evt.currentTarget).hide();
    });
  },
  getTemplateData: function () {
    return {
      tags    : this.model.get('tags'),
      editMode: this.options.editMode
    };
  }
});

module.exports.id = "RunnableTags";
