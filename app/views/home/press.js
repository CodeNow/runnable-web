var BaseView = require('../base_view');

module.exports = BaseView.extend({
  events: {
    'submit form': 'pressLogin'
  }
});

module.exports.id = "home/press";
