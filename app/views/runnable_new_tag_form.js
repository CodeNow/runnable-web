var BaseView = require('./base_view');
var Base = require('../models/base')



module.exports = BaseView.extend({
	tagName: 'form',
  events: {
    'submit' : 'addNewTag'
  },
  postRender: function () {
    this.model.on('change', function () {
      this.render();
    }, this);
  },
  addNewTag: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    var newTagModel = new Base({name:this.$(".tag-form-text").val()}, {app:this.app});
    newTagModel.save({}, {
      url:'/users/me/runnables/' + this.model.id + '/tags',
      method: 'POST'
    });
    // var tag = new Backbone.Model({})
    // tags.save({}, {url:…, method:'PUT'}
    // this.model.save({tags : currentTags}, {});
  }
});

module.exports.id = 'RunnableNewTagForm';
