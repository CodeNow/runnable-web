var BaseView = require('./base_view');
var BaseCollection = require('../collections/base');
var BaseModel = require('../models/base');
var utils = require('../utils');
var global = this;

module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'tags-nav',
  events: {
    'click .remove-tag' : 'removeTag',
  },
  postHydrate: function () {
    BaseCollection = BaseCollection.extend({model:BaseModel});
    this.collection = new BaseCollection(this.model.get('tags'), {
      app: this.app,
      url: '/users/me/runnables/'+this.model.id+'/tags'
    });
    this.listenTo(this.collection, 'add remove reset change', this.render.bind(this));
    this.listenTo(this.model, 'change:tags', this.onChange.bind(this));
  },
  handleBrokenImages: function (evt) {
    this.$('img').each(function (i, img) {
      var clone = new Image();
      // clone.onerror = function () {};
      clone.onload = function () {
        var $img = $(img);
        $img.show();
      };
      clone.src = img.src;
    });
  },
  collectionChange: function () {
    this.model.set('tags', this.collection.toJSON());
  },
  onChange: function () {
    this.collection.reset(this.model.get('tags'), { silent:true });
    this.render();
  },
  removeTag: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var collection = this.collection;
    var tagId = $(evt.currentTarget).data('id');
    var options = utils.successErrorToCB(destroyCallback.bind(this));
    var tag = collection.get(tagId);
    tag.destroy(options);
    this.model.set('tags', collection.toJSON());

    function destroyCallback (err) {
      if (err) {
        this.showError(err);
        collection.add(tag);
        this.model.set('tags', collection.toJSON());
      }
    }
  },
  postRender: function () {
    this.handleBrokenImages();
  },
  getTemplateData: function () {
    return {
      tags    : this.model.get('tags'),
      editMode: this.options.editmode
    };
  }
});

module.exports.id = "RunnableTags";
