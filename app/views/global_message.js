var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className:"alert no-margin no-bg-image",
  preRender: function () {
    var message = this.app.get('message');
    if (!message) {
      this.attributes = {
        style: 'display:none'
      };
    }
    else if (!~this.className.indexOf(message.status)) {
      this.className += (' alert-'+message.status);
    }
  },
  getTemplateData: function () {
    var message = this.app.get('message');
    if (message) {
      this.options.message = message.text;
    }
    return this.options;
  }
});

module.exports.id = "GlobalMessage";
