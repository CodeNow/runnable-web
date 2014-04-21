var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  id: 'show-terminal',
  className: 'tooltip',
  attributes: {
    'data-title': 'Terminal'
  },
});

module.exports.id = "TerminalButton";
