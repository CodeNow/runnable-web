var BaseView = require('../base_view');

module.exports = BaseView.extend({
  events: {
    'submit form' : 'submit',
    'click .card' : 'create'
  },
  submit: function (evt) {
    evt.preventDefault();
    var runnableId = $(evt.currentTarget).serializeObject().id;
    if (runnableId.length === 16) // TODO: for now
      window.location.href = '/new/'+runnableId;
    else
      this.showError('Invalid Runnable Id. Double check the url of the project you are trying to fork.');
  },
  create: function (evt) {
    evt.preventDefault();
    var url = $(evt.currentTarget).attr('href');
    this.app.router.navigate('/new/'+url);
  }
});

module.exports.id = "runnable/new";