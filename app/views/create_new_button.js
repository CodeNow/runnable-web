var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'btn purple',
  attributes: {
    href: '/new'
  }
});

module.exports.id = "CreateNewButton";
