var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'user-img',
  preRender: function () {
    if (this.model) {
      var username = this.model.attributes.username;

      this.attributes = {
        href: '/u/' + username
      };
    }
  }
});

module.exports.id = "UserImage";
