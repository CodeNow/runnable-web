var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .delete': 'deleteRunnable'
  },
  getTemplateData: function () {
    this.options.user = this.app.user;
    return this.options;
  },
  deleteRunnable: function () {
    var self = this;
    alertify.confirm("Are you sure you want to delete '"+this.model.get('name')+"'?", function (e) {
      if (e) {
        // user clicked "ok"
        var opts = utils.cbOpts(self.showIfError, self);
        self.model.destroy(opts);
      } else {
          // user clicked "cancel"
      }
    });
  }
});

module.exports.id = 'RunnableItemView';
