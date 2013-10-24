var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  className: 'main-controls',
  events: {
    'click .run-options' : 'runOptions',
    'click .close' : 'runOptionsClose',
    'blur input' : 'runOptionsSave',
  },
  postRender: function () {
    this.$runOptions = this.$('.run-options');
    this.$runOptions.popover({
      title: '<button type="button" class="close">×</button><h4>Run Options</h4>',
      content: '<form class="form-group form-horizontal clearfix"><label for="save-run">Run cmd</label><input class="form-control" id="save-run" required><div class="saved">Saved</div></form><hr><form class="form-group form-horizontal clearfix"><label for="save-build">Build cmd</label><input class="form-control" id="save-build" required><div class="saved">Saved</div></form></div></div>',
      html: true,
      placement: 'bottom'
    });
  },
  runOptions: function () {
    this.$runOptions.toggleClass('active');
  },
  runOptionsClose: function () {
    this.$runOptions
      .popover('hide')
      .removeClass('active');
  },
  runOptionsSave: function (evt) {
    this.$thisInput = this.$(evt.target);

    if (this.$thisInput[0].value) {
      this.$thisInput.siblings('.saved').fadeIn();
    }
    setTimeout(function(){
      this.$('.saved').stop().fadeOut();
    },1000);
  }
});

module.exports.id = "runnable/index";