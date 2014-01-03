var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .delete': 'deleteRunnable'
  },
  postHydrate: function () {
    this.$('[data-toggle=tooltip]').tooltip({
      placement: 'bottom'
    });
  },
  deleteRunnable: function () {
    var self = this;
    var actionHandler = function(dialogItself){
      // delete
      var opts = utils.cbOpts(self.showIfError, self);
      self.model.destroy(opts);

      //set new count for images and containers
      var oldCount = $('li.active').find('span')[0];
      var newCount = oldCount.innerHTML - 1;
      oldCount.innerHTML = newCount;

      //if image, update reputation count as well
      if (self.options.isimage) {
        $('.gravitar').children('span')[0].innerHTML = newCount;
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