var BaseView = require('./base_view');

module.exports = BaseView.extend({
	tagName: 'form',
  events: {
    'click .icon-plus' : 'addNewTag'
  },
  addNewTag: function (evt) {

  }
});

module.exports.id = 'RunnableNewTagForm';
