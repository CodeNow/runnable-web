var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'iframe',
  className: 'console-output',
  preRender: function () {
    var url = "http://logs." + this.app.get('domain') + "/log.html?termId=" + this.model.get("token");
    this.attributes = {
      src: url
    };
  }
});

module.exports.id = "Tail";
