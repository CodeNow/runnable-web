var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'tail',
  postHydrate: function () {
    setTimeout(function () {
      this.loading(true); // setTimeout so it doesnt get overridden by the router start/end loader
    }.bind(this), 0)
    this.listenToWindowMessage();
  },
  postRender: function () {
    var $iframe = this.$iframe = this.$('iframe');
    var url = "http://logs.:domain/log.html?termId=:token"
      .replace(':domain', this.app.get('domain'))
      .replace(':token' , this.model.get("token"));
    $iframe.attr('src', url);
  },
  listenToWindowMessage: function () {
    if (this.onWindowMessage) {
      this.removeWindowMessageListener();
    }
    else {
      this.onWindowMessage = function (evt) {
        var hostname = window.location.host.split(':')[0]; //no port
        var runnableSubdomain = new RegExp(hostname.replace('.', '\\.')); //esc periods
        var dispatch = this.app.dispatch;
        var timeout = setTimeout(dispatch.trigger.bind(dispatch, 'ready:box'), 5000);
        if (runnableSubdomain.test(evt.origin)) {
          clearTimeout(timeout);
          dispatch.trigger('ready:box');
          this.loading(false);
        }
      }.bind(this);
    }
    window.addEventListener('message', this.onWindowMessage);
  },
  removeWindowMessageListener: function () {
    window.removeEventListener('message', this.onWindowMessage);
  },
  remove: function () {
    this.removeWindowMessageListener();
    Super.remove.apply(this, arguments);
  },
  loading: function (bool) {
    Super.loading.call(this, bool);
    this.app.set('loading', bool);
  }
});

module.exports.id = "Tail";
