var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;
var utils = require('../utils');
var Implement = require('./implement_modal');
var Specification = require('../models/specification');

module.exports = EditorButtonView.extend({
  tagName: 'button',
  className: 'green',
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
      this.listenTo(dispatch, 'edit:implementation', this.openImplementModal.bind(this));
    }
  },
  postRender: function () {
    console.log("CONTAINER ID: ", this.model.id);
  },
  click: function () {
    if (!this.implementsSpec()) {
      this.openImplementModal();
    }
    else {
      this.run();
    }
  },
  implementsSpec: function () {
    var specificationId = this.model.get('specification');
    if (!specificationId) {
      return true;
    }
    else {
      this.implementation = this.collection.findWhere({
        'implements' : specificationId
      });
      return (this.implementation != null);
    }
  },
  run: function () {
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
      }
      else {
        popup.postMessage("Refresh", "*");
      }
    }, this);
    this.app.dispatch.trigger('run');
  },
  onChangeUnsaved: function (bool) {
    if (bool)
      this.$('span').html('Save and Run');
    else
      this.$('span').html('Run');
  },
  openImplementModal: function (specificationId) {
    var self = this;
    var specification = new Specification({
      _id: specificationId
    });
    specification.fetch(utils.cbOpts(function (err) {
      if (err) {
        return self.showError(err);
      }
      var implement = new Implement({
        app        : self.app,
        model      : specification,
        collection : self.collection,
        parent     : self,
        containerId: self.model.id
      });
      implement.open();
    }));
  }
});

module.exports.id = 'RunButton';
