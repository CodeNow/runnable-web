var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
    $('.terminal-iframe').attr('src', "http://terminals." + this.app.get('domain') + "/term.html?termId=" + this.model.get("token"));
  }
});

module.exports.id = "Terminal";