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

  var utils = this.app.utils;
  Handlebars.registerHelper('urlFriendly', function (str) {
    str = utils.urlFriendly(str);

    return new Handlebars.SafeString(str);
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

Router.prototype.trackImpression = function() {
  if (window._gaq) {
    _gaq.push(['_trackPageview']);
  }
};
