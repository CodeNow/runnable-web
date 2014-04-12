var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'main',
  id: 'embed',
  events: {
  	'click button#embed-run': 'embed_run',
    'terminal-focus': 'terminal_focus',
    'terminal-blur': 'terminal_blur',
    'click a[data-bypass="true"]': 'popup'
  },
  popup: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    window.open(window.location.origin + this.model.appURL());
    return false;
  },
  terminal_focus: function () {
    this.$el.addClass('in');
  },
  terminal_blur: function () {
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
    jQuery('#project-editor').get(0).style.height = "";
    // hacky shit to get ACE editor to redraw
    setTimeout(function () {
      jQuery('body').css('height', '');
      setTimeout(function () {
        jQuery('body').css('height', '100%');
      }, 0);
    }, 0);
  },
  embed_run: function (evt) {
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
