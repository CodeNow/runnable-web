var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .delete': 'deleteRunnable'
  }
  getTemplateData: function () {
    this.options.user = this.app.user;
    return this.options;
  },
  deleteRunnable: function () {
    var self = this;
    var actionHandler = function(dialogItself){
      // delete
      var opts = utils.cbOpts(self.showIfError, self);
      self.model.destroy(opts);

      dialogItself.close();
    };

    this.showPrompt({
      message:
        '<h3>Confirm Delete</h3><p>'+this.model.get('name'),
      actionLabel: 'Delete',
      actionHandler: actionHandler
    });
  }
});

module.exports.id = 'RunnableItemView';
