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
    alertify.confirm("Are you sure you want to delete '"+this.model.get('name')+"'?", function (e) {
      if (e) {
        // user clicked "ok"
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
      } else {
          // user clicked "cancel"
      }
    });
  }
});

module.exports.id = "DashboardItemView";