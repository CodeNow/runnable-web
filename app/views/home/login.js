var BaseView = require('../base_view');

module.exports = BaseView.extend({
  events: {
    'submit form' : 'login'
  },
  defaultHeader: "Log in to Runnable",
  postInitialize: function (options) {
    this.options.header = this.options.header || this.defaultHeader;
    this.options.fullpage = true;
  },
  login: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    this.app.user.login(formData.username, formData.password, function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.app.router.navigate('/', true);
      }
    }.bind(this));
  },
  showError: function (err) {
    alert(err);
  }
});

module.exports.id = "home/login";
