var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id:'jobs',
  events: {
    'click .front-learn': 'learnMoreFrontend',
    'click .view-positions': 'scrollToJobs'
  },
  postRender: function () {
    setTimeout(function () {
      $.stellar();
    }, 100); // timeout for clientside hit, else doesnt work..
  }
});

module.exports.id = "user/oauth";
