var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;
var utils = require('../utils');

module.exports = EditorButtonView.extend({
  tagName: 'button',
  className: 'run-button btn-primary',
  events: {
    'click' : 'click'
  },
  preRender: function () {
    Super.preRender.call(this);
  },
  postHydrate: function () {
    Super.postHydrate.call(this);
    var dispatch = this.app.dispatch;
    if (dispatch) {
      this.listenTo(dispatch, 'unsaved:files', this.onChangeUnsaved.bind(this));
    }
  },
  postRender: function () {
    console.log("CONTAINER ID: ", this.model.id);
  },
  click: function () {
    var url = '/'+this.model.id+'/output';
    var windowName = this.model.id+'output';
    var popup = window.open(url, windowName);
    this.disable(true);
    this.model.run(function (err) {
      this.disable(false);
      if (err) {
        this.showError(err);
        popup.close();
        _rollbar.push({level: 'error', msg: "Couldn't start container", errMsg: err});
      } else {
        popup.postMessage("Refresh", "*");
      }
    }, this);
    this.app.dispatch.trigger('run');
  },
  onChangeUnsaved: function (bool) {
    if (bool)
      this.$('span').html(' Save and Run');
    else
      this.$('span').html(' Run');
  }
});

module.exports.id = 'RunButton';
