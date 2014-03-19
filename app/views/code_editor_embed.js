var BaseView = require('./base_view');
var _ = require('underscore');
var Image = require('../models/image');

module.exports = BaseView.extend({
  id: 'code-editor',
  events: {
    'click #open-file-explorer': 'showFiles'
  },
  className: 'in', // file browser open
  postHydrate: function () {
    var model = this.model;
    var canEdit = this.app.user.canEdit(model);

    // if not canEdit(owner or admin) and Image page
    var dispatch = this.app.dispatch;
    dispatch.on('toggle:readme', this.toggleReadme, this);

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
    this.$el.toggleClass('in');
    this.$('#project-editor').resize();
  },
  toggleReadme: function (open) {
    console.log('toggleReadme');
    var $projectEditorContainer = this.$('#project-editor-container');

    if (open) {
      $projectEditorContainer.addClass('show-readme');
    }
    else {
      $projectEditorContainer.removeClass('show-readme');
    }
  },
  getTemplateData: function () {
    // only rendered once.. passes through context
    var opts = _.extend(this.options.context, this.options);
    var readmeFile = opts.rootDir.contents.find(function(data){
      return data.get('name') && data.get('name').toLowerCase() === 'readme.md';
    });
    opts.showReadme = (readmeFile) ? true : false;
    return opts;
  }
});

module.exports.id = "CodeEditor";
