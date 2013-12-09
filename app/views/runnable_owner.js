var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
	id:'project-author',
  className: 'col-sm-3 clearfix',
  postRender: function () {
    this.$('.project-author-icon ~ .rating').tooltip({
      title: '13,295 published Runnables',
      placement: 'bottom'
    });

    this.$('li .rating').tooltip({
      title: '4,392 published in jQuery',
      placement: 'bottom'
    });
  }
});

module.exports.id = "RunnableOwner";
