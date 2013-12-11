var _ = require('underscore');
var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;
var utils = require('../utils');
var noop = function () {};

module.exports = EditorButtonView.extend({
  tagName: 'button',
  className: 'btn green run-button',
  events: {
    'click' : 'click'
  },
  postInitialize: function () {
    if (this.options.htmlonly) {
      this.events = {};
      this.postHydrate = noop;
      this.postRender = noop;
      this.getTemplateData = function () { return this.options; };
    }
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
    this.listenTo(this.model, 'change:specification', this.setImplementLinkModel.bind(this));
  },
  postRender: function () {
    // Leave this here for debugging!
    console.log("CONTAINER ID: ", this.model.id);
    // implementation interactions through implement_link
    this.implementLink = _.findWhere(this.childViews, {name:'implement_link'});
  },
  click: function () {
    if (!this.userImplementedSpec()) {
      var modal = this.openImplementModal();
    }
    else {
      this.run();
    }
  },
  getTemplateData: function () {
    this.options.specification = this.collection.get(this.model.get('specification'));
    return this.options;
  },
  userImplementedSpec: function () {
    return this.implementLink.userImplementedSpec();
  },
  openImplementModal: function () {
    var opts = {
      header: 'Before you Run Please Enter Required Keys for {{name}}',
      savetext: 'Save',
      onSaveSuccess: this.saveImplementationSuccess.bind(this),
      runbutton: this
    };
    return this.implementLink.openImplementModal(null, opts);
  },
  openOutput: function () {
    var url = '/'+this.model.id+'/output';
    var windowName = this.model.id+'output';
    this.popup = window.open(url, windowName);
    this.popup.onload = function () {
      if (this.model.get('build_cmd') && this.filesAreUnsaved) {
        this.popup.postMessage('stream:build', '*');
      }
      else {
        this.popup.postMessage('stream:run', '*');
      }
    }.bind(this);
  },
  refreshOutput: function () {
    this.popup.location = this.popup.location;
  },
  closeOutput: function () {
    if (this.popup) {
      this.popup.close()
    }
  },
  run: function () {
    this.openOutput();
    this.disable(true);
    this.model.saveOpenFiles(function (err) {
      this.disable(false);
      if (err) {
        this.showError(err);
        this.popup.close();
      }
    }, this);
    this.app.dispatch.trigger('run'); // for tracking
  },
  saveImplementationSuccess: function () {
    if (this.userImplementedSpec()) this.run();
  },
  onChangeUnsaved: function (bool) {
    this.filesAreUnsaved = bool;
    if (bool) {
      this.$('span').eq(0).html('Save and Run');
    }
    else {
      this.$('span').eq(0).html('Run');
    }
  },
  setImplementLinkModel: function () {
    //hack
    var spec = this.collection.get(this.model.get('specification'));
    this.implementLink.options.model = spec;
    this.implementLink.model = spec;
  }
});

module.exports.id = 'RunButton';
