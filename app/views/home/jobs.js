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
  },
  scrollToJobs: function (evt) {
    evt.preventDefault();
    $('html, body').animate({
        scrollTop: this.$("#jobs-open-positions-list").offset().top
    }, 400);
  }
});

module.exports.id = "home/jobs";
