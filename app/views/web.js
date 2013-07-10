var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
    console.log("http://" + this.model.get("web"));
    console.log("http://" + this.model.get("terminal"));

    $('.web-iframe').attr('src', "http://" + this.model.get("web"));
    $('.project-tail-iframe').attr('src', "http://" + this.model.get("logs"));
  }
});

module.exports.id = "Web";
