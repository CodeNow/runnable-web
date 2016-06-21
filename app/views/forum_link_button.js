var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'btn purple',
  attributes: {
    href: ''
  },
  postRender: function () {
    this.el.href = 'http://google.com';
  }
});

module.exports.id = "ForumLinkButton";
