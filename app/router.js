var BaseClientRouter = require('rendr/client/router');
var Handlebars = require('handlebars');
var Backbone   = require('backbone');
var _ = require('underscore');
var Super = BaseClientRouter.prototype;

// Add Handlebars helpers
require('./handlebarsHelpers').add(Handlebars);

var Router = module.exports = function Router(options) {
  BaseClientRouter.call(this, options);
};

Router.prototype.__proto__ = BaseClientRouter.prototype;

Router.prototype.postInitialize = function() {
  this.app.dispatch = _.clone(Backbone.Events);

  this.on('action:start', this.trackImpression, this);
  this.on('action:start', this.scrollTop, this);
  this.on('action:end', this.scrollTop, this);

  // set up ace worker urls
  var config = ace.require("ace/config"); // or simply ace.config
  [
    'javascript',
    'coffee',
    'json',
    'lua',
    'php',
    'xquery'
  ]
  .forEach(function (worker) {
    config.setModuleUrl(
        "ace/mode/"+worker+"_worker",
        "/scripts/ace/worker-"+worker+".js"
    );
  });

  $.fn.once = $.fn.one; // for backbone

  $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };
};

Router.prototype.handleError = function (err) {
  var viewPath;
  if (err.status && err.status === 404 && err.status === 403) {
    // 404 path
    viewPath = '404';
  }
  else {
    viewPath = '500';
  }
  console.log(err.status, 'Error:', err);
  this.appView.$content = $('html');
  var View = this.getView(viewPath);
  this.currentView = new View();
  this.renderView();
};

Router.prototype.updateMetaInfo = function (meta) {
  if (!meta) return;
  if (meta.title) {
    $('title').html(meta.title);
  }
  if (meta.description) {
    $('meta[name=description]').attr('content', meta.description);
  }
  if (meta.canonical) {
    $('link[rel=canonical]').attr('href', meta.canonical);
  }
};

Router.prototype.getRenderCallback = function () {
  var self = this;
  var callback = Super.getRenderCallback.apply(this, arguments); // pass on if no err
  return function(err, viewPath, locals) {
    if (err) {
      self.handleError(err);
    }
    else {
      var _locals = self.defaultHandlerParams(viewPath, locals, {controller:'', action:''})[1];
      self.updateMetaInfo(_locals.page);
      callback(err, viewPath, locals);
    }
  };
};

Router.prototype.getMainView = function(views) {
  var $content = this.appView.$content;
  return _.find(views, function(view) {
    return (view.$el.parent().is($content) && view.name != 'app_user');
  });
};

Router.prototype.trackImpression = function() {
  Track.pageView();
};

Router.prototype.scrollTop = function (app, loading) {
  $(document).scrollTop(0);
};
