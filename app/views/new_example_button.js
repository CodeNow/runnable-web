var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  attributes: {
    href: '/new'
  },
  className: "btn-secondary block"
});

module.exports.id = "NewExampleButton";
