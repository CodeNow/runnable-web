var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
    console.log("Terminals model is", this.model);
    // $('.terminal-iframe').attr('src', "http://" + this.model.container.get("terminal"));
  }
});

module.exports.id = "Terminal";
