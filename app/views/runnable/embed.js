var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'main',
  id: 'embed',
  events: {
    'click #embed-run'            : 'embedRun',
    'terminal-focus'              : 'terminalFocus',
    'terminal-blur'               : 'terminalBlur',
    'click a[data-bypass="true"]' : 'popup'
  },
  popup: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    window.open(window.location.origin + this.model.appURL());
    return false;
  },
  terminalFocus: function () {
    this.$el.addClass('in');
  },
  terminalBlur: function () {
    this.$el.removeClass('in');
  },
  postRender: function () {
    $('body,#content').css('height', '100%');
    this.childViewContainer = _.findWhere(this.childViews, {name: 'terminal'}).model;

    this.collection.on('change', function(){
      this.embed_stop();
    }.bind(this));
  },
  embed_stop: function () {
    if(this.options.showTerminal) {
      this.$el.addClass('with-terminal');
    }
    this.$el.find('#project-editor-container').removeClass('with-output');
    this.$el.find('#run-output').html('');
    this.$el.find('#page-loader').hide().removeClass('loading');
  },
  embedRun: function (evt) {
    evt.stopPropagation();
    var self = this;
    this.collection.unselectAllFiles();

    var container = this.childViewContainer;
    var url       = '/'+container.id+'/output';
    var height    = this.$el.find('#project-editor').height();
    var iframe    = document.createElement('iframe');
    iframe.src = url;
    iframe.onload = function () {
      self.$el.find('#page-loader').hide().removeClass('loading');
    };

    this.$el.removeClass('with-terminal').removeClass('in');
    this.$el.find('#page-loader').show().addClass('loading');
    this.$el.find('#project-editor-container').addClass('with-output');
    this.$el.find('#run-output').css('height', height + 'px').html(iframe);

  },
  preRender: function () {
    this.className = (this.options.showTerminal) ? 'with-terminal' : '';
  }
});

module.exports.id = "runnable/embed";
