var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postRender: function () {
    $('.web-iframe').attr('src', "http://" + this.model.get("docker_id") + "." + this.app.get('domain'));
    $('.project-tail-iframe').attr('src', "http://logs." + this.app.get('domain') + "/log.html?termId=" + this.model.get("token"));
  }
});

module.exports.id = "Web";
