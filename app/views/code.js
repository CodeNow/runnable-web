var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');

module.exports = BaseView.extend({
  className: 'tab-pane',
  // minHeight: 300,
  // maxHeight: 550,
  events: {
    'copy': 'onCopy',
    'paste': 'onPaste',
    'cut': 'onCut'
  },
  getTemplateData: function () {
    //for serverside render
    var selectedFile = this.collection.selectedFile();
    var code = (selectedFile && selectedFile.get('content')) || '';
    return {
      code: code
    };
  },
  postRender: function () {
    // render should only occur once for this view,
    // setFile is what updates the editor.
    // this.setHeight(this.minHeight);
    var self = this;
    this.editor = ace.edit(this.el);
    this.editor.setTheme(ace.require('ace/theme-textmate'));
    this.editor.setShowPrintMargin(false);
    // you can attach events here since render only occurs once for this view
    var openFiles = this.collection;
    this.setFile(openFiles.selectedFile());
    this.listenTo(openFiles, 'change:selected', this.changeSelected.bind(this));
    //debounce events
    this.adjustHeightToContents = _.debounce(this.adjustHeightToContents, 100, true);
    this.onScrollLeft = _.debounce(this.onScrollLeft, 200, true);
    this.onScrollTop = _.debounce(this.onScrollTop, 200, true);
  },
  changeSelected: function (model, selected) {
    if (selected) {
      this.setFile(model);
    }
  },
  setFile: function (file) {
    // detach previous file events/session
    this.detachFile(this.file);
    // set current file
    if (!file) {
      // all files closed
      this.file = null;
      this.$el.hide();
    }
    else {
      this.attachFile(file);
      this.adjustHeightToContents();
    }
  },
  detachFile: function (file) {
    if (file) {
      var session = file.editorSession;
      this.stopListening(file);
      this._detachSessionEvents(session);
    }
  },
  _createSession: function (file) {
    if (!utils.exists(file.get('content'))) { //TODO:  content null.. right now content null does not mean unfetched it means unsupported
      alert('This file format is not supported by our editor.');
      _rollbar.push({level: 'error', msg: "Couldn't open client requested file", errMsg: file.get('name')});
      this.file = null;
      file.trigger('close:file', file);
    }
    else if (file.get('content').length > 10000 &&
      !confirm('This file is huge are you sure you want to open it (might crash or take a looong time)?')
    ) {
      this.file = null;
      file.trigger('close:file', file);
    }
    else {
      this.file = file;
      session = file.editorSession = ace.createEditSession(file.get('content'));
      this.editor.setSession(session);
      session.setMode(this.getMode(file.get('name')));
      session.setTabSize(2);
      session.setUseSoftTabs(true);
      this._fileEvents(file);
      this._sessionEvents(session, file);
    }
  },
  _fileEvents: function (file) {
    var self = this;
    this.listenTo(file, 'change:content', function () {
      if (file.editorSession.getValue() !== file.get('content')) {
        // use case: sync doesnt update open-file contents unless the session is updated
        // if check blocks user edit change events
        if (file.editorSession) this.stopListening(file.editorSession);
        self._createSession(file);
      }
    });
  },
  _sessionEvents: function (session, file) {
    session.on('change',           this.onEdit.bind(this, file)); // change events are slow and sometimes occur after a file has been switched so bind it here.
    session.on('changeScrollLeft', this.onScrollLeft.bind(this));
    session.on('changeScrollTop',  this.onScrollTop.bind(this));
  },
  _detachSessionEvents: function (session) {
    session.removeAllListeners('change');
    session.removeAllListeners('changeScrollLeft');
    session.removeAllListeners('changeScrollTop');
  },
  attachFile: function (file) {
    var editor = this.editor;
    var options, session;
    if (file.editorSession) {
    // if (false) {
      this.hideLoader();
      // resume session if session exists
      var session = file.editorSession;
      editor.setSession(session);
      if (session.getValue() !== file.get('content')) {
        session.setValue(file.get('content')); // sync for previously opened files but not currently open
      }
      this._fileEvents(file);
      this._sessionEvents(session, file);
    }
    else {
      // init file session
      // fetch file if unfetched -- maybe change this to always?
      if (file.unFetched()) {
        this.showLoader();
        options = utils.cbOpts(function (err) {
          this.hideLoader();
          if (err) {
            this.showError(err);
          }
          else {
            this._createSession(file);
          }
        }, this);
        file.fetch(options);
      }
      else {
        this._createSession(file);
      }
    }
    // always
    this.$el.show();
    this.editor.focus();
  },
  onScrollLeft: function() {
    if (this.file)
    Track.event('Code View', 'Editor Scroll Left', {projectId: this.file.id});
  },
  onScrollTop: function() {
    if (this.file)
    Track.event('Code View', 'Editor Scroll Tops', {projectId: this.file.id});
  },
  getMode: function (filename) {
    this.modelist = this.modelist || ace.require('ace/ext/modelist');
    var modeInfo = this.modelist.getModeForPath(filename);
    var mode = ace.require(modeInfo.mode) || ace.require('ace/mode/markdown'); //default

    return (new mode.Mode());
  },
  onEdit: function (file) {
    this.adjustHeightToContents();
    var value = this.editor.getValue();
    file.set('content', value);
  },
  adjustHeightToContents: function () {
    var editor = this.editor;
    var min = this.minHeight;
    var max = this.maxHeight;
    var newHeight = editor.getSession().getScreenLength() *
      editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
    if (newHeight < min) newHeight = min;
    if (newHeight > max) newHeight = max;
    this.setHeight(newHeight+"px");
    this.editor.resize();
  },
  setHeight: function (height) {
    if (typeof height == 'number') {
      height = height + 'px'; // assume px
    }
    this.el.style.height = height;
    this.$('.ace_content').height(height);
  },
  hideLoader: function () {
    console.log('hide loader');
  },
  showLoader: function () {
    console.log('show loader');
  },
  showError: function (err) {
    alert(err);
  },
  onCopy: function (evt) {
    this.app.dispatch.trigger('copy');
  },
  onPaste: function (evt) {
    this.app.dispatch.trigger('paste');
  },
  onCut: function (evt) {
    this.app.dispatch.trigger('cut');
  }
});

module.exports.id = "Code";
