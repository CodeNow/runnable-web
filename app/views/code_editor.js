var BaseView = require('./base_view');
var _ = require('underscore');
var Image = require('../models/image');

module.exports = BaseView.extend({
  id: 'code-editor',
  events: {
    'click #open-file-explorer': 'showFiles',
    'click #open-readme':        'openReadme',
    'event-file-open':           'closeReadme'
  },
  postRender: function () {
    this.$showFilesButton = this.$('.btn-show-file-browser');
    this.$fileBrowser     = this.$('.file-browser');
    this.$openReadme      = this.$('#open-readme');
    this.$el.toggleClass('in');
  },
  postHydrate: function () {
    var model = this.model;
    var canEdit = this.app.user.canEdit(model);

    // if not canEdit(owner or admin) and Image page
    var dispatch = this.app.dispatch;
    if (!canEdit && model instanceof Image) {
      model.increment('views');
      dispatch.on('copy',  model.increment.bind(model, 'copies'));
      dispatch.on('paste', model.increment.bind(model, 'pastes'));
      dispatch.on('cut',   model.increment.bind(model, 'cuts'));
      dispatch.on('run',   model.increment.bind(model, 'runs'));
    }
    else {
      this.track('View');
    }
  },
  increment: function (statName) {
    return function (trackingData) {
      model.increment(statName);
    };
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
    this.trackEvent(name, data, 'Code');
    Track.increment(name.toLowerCase());
  },
  showFiles: function (evt) {
    this.$('#project-editor').resize();
  },
  openReadme: function (evt) {
    this.$openReadme.addClass('active');
    this.$('ul#project-editor-tabs li.active').removeClass('active');
    this.$('aside#file-explorer li.active').removeClass('active');
  },
  closeReadme: function (evt) {
    this.$openReadme.removeClass('active');

  },
  getTemplateData: function () {
    // only rendered once.. passes through context
    return _.extend(this.options.context, this.options);
  }
});

module.exports.id = "CodeEditor";
