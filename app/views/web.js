var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'output-results-container',
  className: 'resizable-iframe',
  preRender: function () {
    var optClassName = this.options.classname;
    if (optClassName && !~this.className.indexOf(optClassName)) {
      this.className += ' ' + optClassName;
    }
  },
  getTemplateData: function () {
    this.options.baseurl = "http://" + this.model.get("webToken") + "." + this.app.get('domain');
    return this.options;
  },
  postHydrate: function () {
    this.options.buildmessage = this.options.buildmessage || false; //init
    this.listenTo(this.app.dispatch, 'toggle:buildMessage', this.toggleBuildMessage);
  },
  toggleBuildMessage: function (bool) {
    if (this.options.buildmessage !== bool) {
      this.options.buildmessage = bool;
      this.render();
    }
  },
  renderCount: 0,
  postRender: function () {
    // iframe loader
    if (!this.options.buildmessage) {
      this.listenTo(this.app.dispatch, 'change:url', this.setUrl.bind(this));
      this.$iframe = this.$('iframe');
      this.loading(true);
      this.$iframe.load(this.loading.bind(this, false)); // load event remains attached, for subsequent page loads
      this.appUrl();
    }
    if (this.model.get('build_cmd')) {
      // resize handle cannot be added multiple times.
      // since this view is rendered multiple times when there
      // is a build step 1 before receiving build message
      // 2 after recieving, and 3 for final render; wait
      // for final render to add resize handle
      this.renderCount++;
      if (this.renderCount === 3) {
        this.addResizeHandle();
      }
    }
    else {
      this.addResizeHandle();
    }
  },
  addResizeHandle: function () {
    tony = this;
    var self = this;
    var container = this.model;
    var showingBothPanes = !container.get('output_format');
    if (showingBothPanes && !this.options.buildmessage) {
      debugger;
      this.$el.resizable({
        alsoResizeReverse: "#output-terminal-container",
        handles: "s",
        start: function () {
          $(".resizable-iframe").each(function (index, element) {
            var d = $('<div class="iframe-cover" style="z-index:1000000;position:absolute;width:100%;top:0px;left:0px;bottom:0;"></div>');
            $(element).append(d);
          });
        },
        stop: function (e, ui) {
          $('.iframe-cover').remove();
          var parent = $(window);
          $('.resizable-iframe').each(function(){
            var $this = $(this);
            $this.css({
              width : $this.width()  / parent.width()  * 100 + "%" ,
              height: $this.height() / parent.height() * 100 + "%"
            });
          });
        }
      });
      $( "#output-terminal-container" ).resizable();
    }
  },
  refresh: function () {
    this.$iframe.attr('src', this.$iframe.attr('src'));
  },
  appUrl: function () {
    this.setUrl(this.options.baseurl);
  },
  setUrlPath: function (path) {
    this.loading(true);
    if (path[0] !== '/') path = '/' + path;
    var url = this.options.baseurl+path;
    this.$iframe.attr('src', url);
  },
  setUrl: function (url) {
    this.loading(true);
    this.$('iframe').attr('src', url);
  },
  loading: function (bool) {
    if (utils.exists(bool)) {
      if (bool) {
        this.ifNotThenShowProgress();
      }
      else {
        this.ifNotThenShowProgress();
        this.progressDone();
      }
    }
    return Super.loading.apply(this, arguments);
  },
  ifNotThenShowProgress: function () {
    if (!this.nprogress) {
      this.nprogress = require('nprogress').create(); // donot require this serverside! it will crash
      this.nprogress.configure({ el:this.el, showSpinner:false });
      this.nprogress.start();
    }
  },
  progressDone: function () {
    this.nprogress.done();
    this.nprogress = null;
  }
});

module.exports.id = "Web";
