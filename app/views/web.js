var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
  	debugger;
    $('.web-iframe').attr('src', "http://" + this.model.get("docker_id") + "." + "runnableapp.dev");
    $('.project-tail-iframe').attr('src', "http://logs.runnableapp.dev/log.html?termId=" + this.model.get("token"));
  }
});

module.exports.id = "Web";
