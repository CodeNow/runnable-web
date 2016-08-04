var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'btn purple',
  attributes: {
    href: ''
  },
  postRender: function () {
    this.el.href = this.app.get('forumURL');
  }
});

module.exports.id = "ForumLinkButton";
