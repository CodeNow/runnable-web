var BaseView = require('../base_view');

module.exports = BaseView.extend({
  defaultHeader: "Sign up for Runnable",
  postInitialize: function (options) {
    this.options.header = this.options.header || this.defaultHeader;
    this.options.fullpage = true;
  },
  register: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    this.app.user.register(formData.email, formData.username, formData.password, function (err) {
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

module.exports.id = "SignupModal";
