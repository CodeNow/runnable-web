var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  className: 'main-controls',
  events: {
    'click .run-options' : 'runOptions'
  },
  postRender: function () {
    this.$runOptions = this.$('.run-options');
    this.$runOptions.popover({
      title: '<button type="button" class="close">×</button><h4>Run Options</h4>',
      content: '<form class="form-group"><input class="form-control" required><button class="green">Run</button></form><hr><form class="form-group"><input class="form-control" required><button class="green">Run &amp; Build</button></form></div></div>',
      html: true,
      placement: 'bottom'
    });
  },
  runOptions: function (evt) {
    this.$runOptions.toggleClass('active');
  }
});

module.exports.id = "runnable/index";