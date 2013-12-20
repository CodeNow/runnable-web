var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
	id:'project-author',
  className: 'col-sm-3 clearfix',
  postRender: function () {
    this.$('.project-author-icon').siblings('span').tooltip({
      placement: 'bottom',
      title: this.model.get('imagesCount')+' published Runnables'
    });
  }
});

module.exports.id = "RunnableOwner";
