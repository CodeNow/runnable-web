var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'popover fade bottom in'
});

module.exports.id = "RunPopover";