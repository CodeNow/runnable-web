var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
    $('.terminal-iframe').attr('src', "http://" + this.model.get("terminal"));
  }
});

module.exports.id = "Terminal";
