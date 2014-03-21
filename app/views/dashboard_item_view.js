var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .delete': 'deleteRunnable'
  },
  deleteRunnable: function () {
    var self = this;
    var actionHandler = function(dialogItself){
      // delete
      var opts = utils.cbOpts(self.showIfError, self);
      self.model.destroy(opts);

      //set new count for images and containers
      var oldCount = $('.toggles > .active').find('span')[0];
      var newCount = oldCount.innerHTML - 1;
      oldCount.innerHTML = newCount;

      //if image, update reputation count as well
      if (self.options.isimage) {
        $('#gravatar').find('span')[0].innerHTML = newCount;
      }
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

module.exports.id = "DashboardItemView";