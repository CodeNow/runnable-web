var BaseClientRouter = require('rendr/client/router');
var Handlebars = require('handlebars');

var Router = module.exports = function Router(options) {
  BaseClientRouter.call(this, options);
};

Router.prototype.__proto__ = BaseClientRouter.prototype;

Router.prototype.postInitialize = function() {
  this.on('action:start', this.trackImpression, this);
  // Register Handlebars helpers here for now
  Handlebars.registerHelper('if_eq', function(context, options) {
    if (context == options.hash.compare)
      return options.fn(this);
    return options.inverse(this);
  });

  Handlebars.registerHelper('exists', function(context, options) {
    if (context !== null && context !== undefined)
      return options.fn(this);
    return options.inverse(this);
  });

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
        "/ace/worker-"+worker+".js"
    );
  });
};

Router.prototype.trackImpression = function() {
  if (window._gaq) {
    _gaq.push(['_trackPageview']);
  }
};
