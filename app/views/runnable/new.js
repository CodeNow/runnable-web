var BaseView = require('../base_view');
var lock = require('../../lock');

module.exports = BaseView.extend({
  events: {
    'submit form' : 'submit',
    'click .card' : 'create',
    'change select' : 'changeLanguage'
  },
  submit: function (evt) {
    evt.preventDefault();
    var runnableId = $(evt.currentTarget).serializeObject().id;
    if (runnableId.length === 16) // TODO: for now
      window.location.href = '/new/'+runnableId;
    else
      this.showError('Invalid Runnable Id. Double check the url of the project you are trying to fork.');
  },
  getTemplateData: function () {
    this.options.lock = lock;
    return this.options;
  },
  changeLanguage: function () {
    var langVal = this.$('select')[0].value;
    this.$('.dropdown').text(langVal);
  }
});

module.exports.id = "runnable/new";