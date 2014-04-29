var BaseView = require('./base_view');
var BaseCollection = require('../collections/base');
var BaseModel = require('../models/base');
var utils = require('../utils');
var _ = require('underscore');

module.exports = BaseView.extend({
  id: 'project_tags',
  tagName: 'ul',
  className: 'tags',
  events: {
    'click .remove-2' : 'removeTag',
  },
  postHydrate: function () {
    BaseCollection = BaseCollection.extend({model:BaseModel});
    this.collection = new BaseCollection(this.model.get('tags'), {
      app: this.app,
      url: '/users/me/runnables/'+this.model.id+'/tags'
    });
    this.listenTo(this.model, 'change:tags', this.render.bind(this));
  },
  getTemplateData: function () {
    var opts = this.options;
    return _.extend(opts, {
      isVerified: this.app.user.isVerified()
    });
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
  }
});

module.exports.id = "ProjectTags";
