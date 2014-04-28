var BaseView = require('./base_view');
var Tag = require('../models/runnable/tag');
var Tags = require('../collections/runnable/tags');
var utils = require('../utils');


module.exports = BaseView.extend({
  id: 'runnable-tags-edit',
  className: 'popover fade bottom',
  events: {
    'submit' : 'addNewTag'
  },
  postHydrate: function () {
    this.collection = new Tags(this.model.get('tags'), { app: this.app, runnableId:this.model.id  });
    this.listenTo(this.collection, 'add remove change', this.collectionChange.bind(this));
    this.listenTo(this.model, 'change:tags', this.onChange.bind(this));
  },
  collectionChange: function () {
    this.model.set('tags', this.collection.toJSON());
  },
  onChange: function () {
    this.collection.reset(this.model.get('tags'), { silent:true });
    this.render();
  },
  addNewTag: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var formData = $(evt.currentTarget).serializeObject();
    var collection = this.collection;
    this.disableForm();
    var tag = new Tag(formData, { app:this.app, runnableId:this.model.id });
    var options = utils.cbOpts(saveCallback.bind(this));
    tag.save({}, options);
    function saveCallback (err, tagSaved) {
      this.enableForm();
      if (err) {
        this.showError(err);
        this.$('input').val(tag.get('name'));
      }
      else {
        collection.add(tagSaved);
        this.$('input').val('');
        this.$('input').focus();
      }
    }
  },
  disableForm: function () {
    if (!this.formDisabled) {
      this.formDisabled= true;
      this.$('input').attr('disabled', 'disabled');
      var $button = this.$('button');
      $button.attr('disabled', 'disabled');
      this.oldButtonHTML = $button.html();
      $button.html('saving');
    }
  },
  enableForm: function () {
    this.formDisabled = false;
    this.$('input').removeAttr('disabled');
    var $button = this.$('button');
    $button.removeAttr('disabled');
    $button.html(this.oldButtonHTML);
  }
});

module.exports.id = 'RunnableNewTagForm';
