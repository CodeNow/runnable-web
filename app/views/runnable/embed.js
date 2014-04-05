var BaseView = require('../base_view');

module.exports = BaseView.extend({
  tagName: 'main',
  id: 'embed',
  preRender: function () {
  	this.className = (this.options.showTerminal) ? 'with-terminal' : '';
  }
});

module.exports.id = "runnable/embed";
