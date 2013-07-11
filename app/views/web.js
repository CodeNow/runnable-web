var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
    console.log("http://" + this.model.get("docker_id") + "." + "runnableapp.dev");
    $('.web-iframe').attr('src', "http://" + this.model.get("docker_id") + "." + "runnableapp.dev");
    $('.project-tail-iframe').attr('src', "http://" + this.model.get("logs"));
  }
});

module.exports.id = "Web";
