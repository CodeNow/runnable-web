var BaseView = require('./base_view');

module.exports = BaseView.extend({
  events: {
    'click .icon-external-link' : 'popOpenTerminal'
  },
  popOpenTerminal: function () {
    window.open("http://terminals." + this.app.get('domain') + "/term.html?termId=" + this.model.get("token"), "_blank");
  },
  postRender: function () {
    $('.terminal-iframe').attr('src', "http://terminals." + this.app.get('domain') + "/term.html?termId=" + this.model.get("token"));
  }
});

module.exports.id = "Terminal";
