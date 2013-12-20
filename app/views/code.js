var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'pre',
  id: 'project-editor',
  className: 'code',
  // minHeight: 300,
  // maxHeight: 550,
  events: {
    'copy' : 'copy',
    'paste': 'paste',
    'cut'  : 'cut'
  },
  dontTrackEvents: ['copy', 'paste', 'cut'],
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
    this.setTheme('dark');
    this.editor.setShowPrintMargin(false);
    this.editor.renderer.setShowPrintMargin(false);
    // this.editor.renderer.setScrollMargin(8, 8, 0, 0);
    document.getElementById('project-editor').style.fontSize   = '12px';
    document.getElementById('project-editor').style.lineHeight = '20px';
    // you can attach events here since render only occurs once for this view
    var dispatch = this.app.dispatch;
    dispatch.on('change:theme', this.setTheme.bind(this));
    var openFiles = this.collection;
    this.setFile(openFiles.selectedFile(), true);
    this.listenTo(openFiles, 'change:selected', this.changeSelected.bind(this));
    //debounce events
    this.adjustHeightToContents = _.debounce(this.adjustHeightToContents, 100, true);
    this.onScrollLeft = _.debounce(this.onScrollLeft, 5000, true);
    this.onScrollTop = _.debounce(this.onScrollTop, 5000, true);
  },
  setTheme: function (theme) {
    var currentTheme = this.editor.getTheme() || {cssClass:''};
    var currentClass = currentTheme.cssClass;
    if (~theme.indexOf('dark') && !~currentClass.indexOf('runnable_dark')) {
      this.editor.setTheme(ace.require('ace/theme/runnable_dark'));
    }
    else if (~theme.indexOf('light') && !~currentClass.indexOf('runnable_light')) {
      this.editor.setTheme(ace.require('ace/theme/runnable_light'));
    }
  },
  changeSelected: function (model, selected) {
    if (selected) {
      this.setFile(model);
    }
  },
  setFile: function (file, first) {
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
      if (first) {
        // set timeout fixes text editor height for first page hit.
        setTimeout(this.adjustHeightToContents.bind(this), 0);
        setTimeout(this.adjustHeightToContents.bind(this), 100);
        setTimeout(this.adjustHeightToContents.bind(this), 200);
      }
      else {
        this.adjustHeightToContents();
      }
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
      _rollbar.push({level: 'error', msg: "Couldn't open client requested file", errMsg: {name:file.get('name'), user:this.app.user.id}});
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
    // else if (file.get('content').length > 10000 &&
    //   !confirm('This file is huge are you sure you want to open it (might crash or take a looong time)?')
    // ) {
    //   this.file = null;
    //   file.trigger('close:file', file);
    // }
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
    var fileExtension = filename.split('.').pop();

    this.modelist = this.modelist || ace.require('ace/ext/modelist');
    var modeInfo = this.modelist.getModeForPath(filename);

    if (fileExtension == "aspx") {
      modeInfo = {"name":"csharp","caption":"C#","mode":"ace/mode/csharp","extensions":"cs","extRe":{}};
    }
    console.log(modeInfo.mode, ace.require(modeInfo.mode));
    var mode = ace.require(modeInfo.mode) || ace.require('ace/mode/markdown'); //default

    return (new mode.Mode());
  },
  onEdit: function (file, evt) {
    var self = this;

    if (evt.data.action === 'insertText' && evt.data.text && evt.data.text.length >= 4) {
      self.justPasted = evt.data.text;
      self.evtStartLine = evt.data.range.start.row;
      self.evtStartColumn = evt.data.range.start.column;
    }
    else if ((evt.data.action === 'removeText' || evt.data.action === 'removeLines') && evt.data.text && evt.data.text.length >= 4) { // to filter just cut events, ignore delete
      self.justCut = evt.data.text;
      self.evtStartLine = evt.data.range.start.row;
      self.evtStartColumn = evt.data.range.start.column;
    }

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
  copy: function (evt) {
    this.app.dispatch.trigger('copy', {
      content  : this.editor.getCopyText()
    });
  },
  paste: function (evt) {
    var self = this;
    if (!utils.exists(this.justPasted)) {
      setTimeout(dispatch, 10);
    }
    else {
      dispatch();
    }
    function dispatch () {
      self.app.dispatch.trigger('paste', {
        content  : self.justPasted,
        line     : self.evtStartLine,
        column   : self.evtStartColumn
      });
      self.justPasted = null;
    }
  },
  cut: function (evt) {
    var self = this;
    if (!utils.exists(this.justCut)) {
      setTimeout(dispatch, 10);
    }
    else {
      dispatch();
    }
    function dispatch () {
      self.app.dispatch.trigger('cut', {
        content  : self.justCut,
        line     : self.evtStartLine,
        column   : self.evtStartColumn
      });
      Track.increment('copy');
      self.justCut = null;
    }
  }
});

module.exports.id = "Code";
