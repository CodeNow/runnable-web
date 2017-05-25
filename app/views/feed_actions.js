var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  events: {
    'click .soft-delete': 'softDeleteRunnable'
  },
  postRender: function () {
  },
  softDeleteRunnable: function () {
    var self = this;
    var actionHandler = function(dialogItself){
      
      var opts = utils.cbOpts(self.showIfError, self);
      self.model.softDelete();

      var currentRunnable = self.parentView;
      // COMPLETELY UNBIND THE VIEW
      currentRunnable.undelegateEvents();
      
      currentRunnable.$el.removeData().unbind(); 
      
      // Remove view from DOM
      currentRunnable.remove();  
      Backbone.View.prototype.remove.call(currentRunnable);

      dialogItself.close();
    };

    this.showPrompt({
      message:
        '<h3>Confirm Soft Delete</h3><p>'+this.model.get('name'),
      actionLabel: 'Delete',
      actionHandler: actionHandler
    });
  },
  getTemplateData: function () {
    this.options.moderatormode = this.options.app.user.isModerator();
    this.options.userverified = this.options.app.user.isVerified();
    return this.options;
  }

});

module.exports.id = "FeedActions";
