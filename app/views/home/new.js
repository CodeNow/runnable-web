var BaseView = require('../base_view');

module.exports = BaseView.extend({
	tagName: 'section',
  className: 'content',
  events: {
    'submit form' : 'submit'
  },
  submit: function (evt) {
    evt.preventDefault();
    var runnableId = $(evt.currentTarget).serializeObject().id;
    if (runnableId.length === 16) // TODO: for now
      window.location.href = '/new/'+runnableId;
    else
      this.showError('Invalid Runnable Id. Double check the url of the project you are trying to fork.');
  }
});

module.exports.id = "home/new";