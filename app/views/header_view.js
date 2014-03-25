var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'header',
  id: 'primary'
});

module.exports.id = 'HeaderView';