var BaseView = require('./base_view');
module.exports = BaseView.extend({
  className: 'tab-pane with-file-browser',
  // minHeight: 300,
  // maxHeight: 550,
  postRender: function () {
    // render should only occur once for this view, setFile is what updates the editor.
    // this.setHeight(this.minHeight);
    var self = this;
    this.editor = ace.edit(this.el);
    this.editor.setTheme(ace.require('ace/theme-textmate'));
    // you can attach events here since render only occurs once for this view
    var openFiles = this.model.openFiles;
    this.setFile(openFiles.selectedFile());
    this.listenTo(openFiles, 'select:file', this.setFile.bind(this));
    // // this.model.rootDir.on("change:contents", function () {
    //   self.fileModel = self.model.openFiles.selectedFile();
    //   console.log("setting this editors fileModel", self.fileModel);
    // // });

    var editor = this.editor;
    // setTimeout(function () {
    //   var session = ace.createEditSession("1234 KALAMAZOO");
    //   editor.setSession(session);
    //   session.setTabSize(2);
    //   session.setUseSoftTabs(true);

    //   self.$el.show();
    //   self.editor.focus();
    // }, 2000);
  },
  setFile: function (file) {
    // detach previous file events/session
    this.detachFile(this.file);
    // set current file
    this.file = file;
    if (!file) {
      // all files closed
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
      this.stopListening(session);
    }
  },
  attachFile: function (file) {
    var editor = this.editor;
    if (file.editorSession) {
      // resume session if session exists
      editor.setSession(file.editorSession);
    }
    else {
      // init file session
      var session = file.editorSession = ace.createEditSession(file.get('content'));
      editor.setSession(session);
      session.setMode(this.getMode(file.get('name')));
      session.setTabSize(2);
      session.setUseSoftTabs(true);
      this.listenTo(session, 'change',           this.onEdit.bind(this));
      this.listenTo(session, 'changeScrollLeft', this.onScrollLeft.bind(this));
      this.listenTo(session, 'changeScrollTop',  this.onScrollTop.bind(this));

      // session.getMarkers(true).forEach(function (marker) {
      //   session.removeMarker(marker);
      // });
    }
    // always
    this.$el.show();
    this.editor.focus();
  },
  onScrollLeft: function() {
    Track.event('Code View', 'Editor Scroll Left', {projectId: this.model.id});
  },
  onScrollTop: function() {
    Track.event('Code View', 'Editor Scroll Tops', {projectId: this.model.id});
  },
  getMode: function (filename) {
    this.modelist = this.modelist || ace.require('ace/ext/modelist');
    var modeInfo = this.modelist.getModeForPath(filename);
    var mode = ace.require(modeInfo.mode) || ace.require('ace/mode/markdown'); //default

    return (new mode.Mode());
  },
  onEdit: function () {
    this.adjustHeightToContents();
    var value = this.editor.getValue();
    this.fileModel.set('content', value);
  },
  adjustHeightToContents: function () {
    var editor = this.editor;
    var min = this.minHeight;
    var max = this.maxHeight;
    var newHeight = editor.getSession().getScreenLength()
      * editor.renderer.lineHeight
      + editor.renderer.scrollBar.getWidth();
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
    console.log(height);
    console.log(this.$('.ace_content').height());
    this.$('.ace_content').height(height);
  }

});

module.exports.id = "Code";
