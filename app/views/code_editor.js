var BaseView = require('./base_view');
var _ = require('underscore');
var Image = require('../models/image')

module.exports = BaseView.extend({
  events: {
    'click .open-file-explorer' : 'showFiles'
  },
  postRender: function () {
    this.$showFilesButton = this.$('.btn-show-file-browser');
    this.$fileBrowser = this.$('.file-browser');
  },
  postHydrate: function () {
    var model = this.model;
    var canEdit = this.app.user.canEdit(model);

    // if not canEdit(owner or admin) and Image page
    var dispatch = this.app.dispatch;
    if (!canEdit && model instanceof Image) {
      this.incAndTrack('views', 'View')();
      dispatch.on('copy',  this.incAndTrack('copies', 'Copy'));
      dispatch.on('paste', this.incAndTrack('pastes', 'Paste'));
      dispatch.on('cut',   this.incAndTrack('cuts',   'Cut'));
      dispatch.on('run',   this.incAndTrack('runs',   'Run'));
    }
    else {
      this.track('View');
      dispatch.on('copy',  this.track.bind(this, 'Copy'));
      dispatch.on('paste', this.track.bind(this, 'Paste'));
      dispatch.on('cut',   this.track.bind(this, 'Cut'));
      dispatch.on('run',   this.track.bind(this, 'Run'));
    }
  },
  incAndTrack: function (stat, eventName) {
    var model = this.model;
    var self = this;

    return function (trackingData) {
      model.increment(stat);
      self.track(eventName, trackingData);
    };
  },
  track: function (name, data) {
    var model = this.model;

    data = data || {};
    data.projectId = model.id;
    data.isImage = model instanceof Image;
    Track.event('Code', name, data);
    Track.increment(name.toLowerCase());
  },
  showFiles: function (evt) {
    // show file browser
    this.app.dispatch.trigger('toggle:files', true);
  },
  getTemplateData: function () {
    // only rendered once.. passes through context
    return _.extend(this.options.context, this.options);
  }
});

module.exports.id = "CodeEditor";
