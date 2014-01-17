var BaseView = require('./base_view');
var _ = require('underscore');
var Image = require('../models/image');

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
    // show file browser
    this.app.dispatch.trigger('toggle:files', true);
  },
  getTemplateData: function () {
    // only rendered once.. passes through context
    return _.extend(this.options.context, this.options);
  }
});

module.exports.id = "CodeEditor";
