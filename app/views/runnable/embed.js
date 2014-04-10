var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'main',
  id: 'embed',
  events: {
  	'click button#embed-run': 'embed_run'
  },
  postRender: function () {
    $('html,#content').css('height', '100%');
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
  },
  embed_run: function (evt) {
    evt.stopPropagation();
    this.collection.findWhere({selected: true}).set('selected', false);

    $('#page-loader').show().addClass('loading');

    var container = _.findWhere(this.childViews, {name: 'terminal'}).model;

    var url = '/'+container.id+'/output';
    var height = this.$el.find('#project-editor').height();

    this.$el.removeClass('with-terminal').removeClass('in');
    this.$el.find('#project-editor-container').addClass('with-output');
    var iframe = document.createElement('iframe');
    iframe.onload = function () {
      $('#page-loader').hide().removeClass('loading');
    };

    iframe.src = url;
    _.extend(iframe.style, {
      width: '100%',
      height: '100%'
    });
    this.$el.find('#run-output').css('height', height + 'px').html(iframe);

  },
  preRender: function () {
  	this.className = (this.options.showTerminal) ? 'with-terminal' : '';
  }
});

module.exports.id = "runnable/embed";
