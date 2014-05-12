var BaseClientRouter = require('rendr/client/router');
var Handlebars = require('handlebars');
var Backbone   = require('backbone');
var _ = require('underscore');
var Super = BaseClientRouter.prototype;
var utils = require('./utils');
var checkingRetina = false;

// Add Handlebars helpers
require('./handlebarsHelpers').add(Handlebars);

var Router = module.exports = function Router(options) {
  BaseClientRouter.call(this, options);
};

Router.prototype = Object.create(BaseClientRouter.prototype);
Router.prototype.constructor = Router;

Router.prototype.postInitialize = function() {
  this.on('action:start', this.trackImpression, this);
  this.on('action:start', this.scrollTop, this);
  this.on('action:end', this.scrollTop, this);

  // set up ace worker urls
  var aceConfig = ace.require("ace/config"); // or simply ace.config
  [
    'javascript',
    'coffee',
    'json',
    'lua',
    'php',
    'xquery',
    'css'
  ]
  .forEach(function (worker) {
    aceConfig.setModuleUrl(
        'ace/mode/'+worker+'_worker',
        '/vendor/bower/ace-builds/src-min-noconflict/worker-'+worker+'.js'
    );
  });
  // [
  //   'abap','actionscript','ada','asciidoc','assembly_x86','autohotkey','batchfile','c9search','c_cpp','clojure','cobol','coffee',
  //   'coldfusion','csharp','css','curly','d','dart','diff','django','dot','ejs','erlang','forth','ftl','glsl','golang','groovy',
  //   'haml','haskell','haxe','html','html_ruby','ini','java','javascript','json','jsoniq','jsp','jsx','julia','latex','less','liquid',
  //   'lisp','livescript','logiql','lsl','lua','luapage','lucene','makefile','markdown','matlab','mushcode','mushcode_high_rules','mysql',
  //   'objectivec','ocaml','pascal','perl','pgsql','php','powershell','prolog','properties','python','r','rdoc','rhtml','ruby','rust',
  //   'sass','scad','scala','scheme','scss','sh','snippets','sql','stylus','svg','tcl','tex','text','textile','tmsnippet','toml','twig',
  //   'typescript','vbscript','velocity','verilog','xml','xquery','yaml',
  // ]
  // .forEach(function (mode) {
  //   aceConfig.setModuleUrl(
  //     'ace/mode/'+mode,
  //     '/vendor/bower/ace-builds/src-min-noconflict/mode-'+mode+'.js'
  //   );
  // });

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

  //debounce
  this.shake = _.debounce(this.shake, 100, true);
};

Router.prototype.handleError = function (err) {
  var viewPath;
  if (err.status && (err.status === 404 || err.status === 403)) {
    // 404 path
    viewPath = '404';
  }
  else {
    viewPath = '500';
  }
  console.log(err.status, 'Error:', err);
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
    $('meta[name=description]').attr('content', meta.description || meta.title);
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

Router.prototype.isCurrentRoute = function (fragment) {
  var currentFragment = Backbone.history.fragment;
  return currentFragment == fragment ||
    currentFragment+'/' == fragment ||
    '/'+currentFragment == fragment ||
    currentFragment == fragment+'/' ||
    currentFragment == '/'+fragment;
};

Router.prototype.navigate = function (fragment) {
  if (this.isCurrentRoute(fragment)) {
    this.shake();
  }

  // pushState retina.js logic
  // if (window.Retina.isRetina() && !checkingRetina) {
  //   checkingRetina = true;
  //   this.listenTo(this.app, 'change:loading', function (app, loading) {
  //     if (!loading) {
  //       var context = {};
  //       window.Retina.init(context);
  //       utils.allImagesLoaded($('img'), function () {
  //         context.onload();
  //       });
  //     }
  //   });
  // }
  // modal fix - not sure if this is still necessary
  $('body').removeClass('modal-open');
  // navigate fix - (query params -> no query params fix)
  var domain, frag = Backbone.history.getFragment(fragment || '');
  if (Backbone.history.fragment === frag) {
    domain = window.location.protocol +'//'+window.location.host+'/';
    Backbone.history.fragment = Backbone.history.getFragment(window.location.href.replace(domain, ''));
  }
  Super.navigate.apply(this, arguments);
}

Router.prototype.shake = function () {
  var $content = this.appView.$content;
  $content.removeClass('shake');
  setTimeout(function () { // settimeout ensures repeated shakes..
    $content.addClass('shake');
  }, 0);
}