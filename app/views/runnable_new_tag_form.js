var BaseView = require('./base_view');
var BaseModel = require('../models/base')
var BaseCollection = require('../collections/base')
var utils = require('../utils');


module.exports = BaseView.extend({
	tagName: 'form',
  events: {
    'submit' : 'addNewTag'
  },
  postHydrate: function () {
    this.collection = new BaseCollection(this.model.get('tags'), {
      app: this.app,
      url:'/users/me/runnables/'+this.model.id+'/tags'
    });
    this.listenTo(this.collection, 'add remove reset', this.render.bind(this));
    this.listenTo(this.model, 'change:tags', this.onChange.bind(this));
  },
  onChange: function () {
    this.collection.reset(this.model.get('tags'));
  },
  addNewTag: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var formData = $(evt.currentTarget).serializeObject();
    var collection = this.collection;
    var tag = new BaseModel(formData, {app:this.app});
    var options = utils.successErrorToCB(saveCallback.bind(this));
    options.method = 'POST';
    // assume success
    collection.add(tag);
    tag.save({}, options);
    this.model.set('tags', collection.toJSON());
    this.$('input').val('');
    function saveCallback (err, tag) {
      if (err) {
        this.showError(err);
        collection.remove(tag);
        this.model.set('tags', collection.toJSON());
        this.$('input').val(tag.get('name'));
      }
    }
  }
});

module.exports.id = 'RunnableNewTagForm';
