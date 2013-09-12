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
  learnMoreFrontend: function (evt) {
    evt.preventDefault();
    var info = [
      "<li>Learning APIs and creating code examples</li>",
      "<li>Working directly with API Providers to create content</li>",
      "<li>Heavily engaging with the developer community</li>"
    ].join('');
    this.showMessage(info);
  },
  scrollToJobs: function (evt) {
    evt.preventDefault();
    $('body').animate({
        scrollTop: this.$("#jobs-open-positions-list").offset().top
    }, 400);
  }
});

module.exports.id = "home/jobs";
