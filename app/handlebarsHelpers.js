var utils = require('./utils');
var _ = require('underscore');

module.exports.add = function (Handlebars) {
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

  Handlebars.registerHelper('urlFriendly', function (str) {
    str = utils.urlFriendly(str);

    return new Handlebars.SafeString(str);
  });

  Handlebars.registerHelper('dateAgo', function (str) {
    var moment = require('moment');
    str = moment(str).fromNow();
    return new Handlebars.SafeString(str);
  });

  Handlebars.registerHelper('channelHasImage', function (channelName, options) {
    var channelImages = require('./channelImages');
    if (Boolean(channelImages[channelName.toLowerCase()]))
      return options.fn(this);
    return options.inverse(this);
  });

  Handlebars.registerHelper('replace', function (str, options) {
    var opts = options.hash;
    if (opts.concat) str = str+opts.concat;
    return str.replace(opts.pattern, opts.replacement);
  });

  Handlebars.registerHelper('invoke', function (obj, options) {
    var opts = options.hash;
    var args = _.chain(options).omit('method').values().value();
    return obj[opts.method].apply(obj, args);
  });

  Handlebars.registerHelper('if_result', function (obj, options) {
    var opts = options.hash;
    opts.equals = opts.equals || true;
    var args = _.chain(options).omit('method', 'equals').values().value();
    if (obj[opts.method].apply(obj, args) === opts.equals)
      return options.fn(this);
    return options.inverse(this);
  });

  function add (thing, options) {
    var opts = options.hash;
    var args = _.values(options.hash);
    var add = args.reduce(function (a, b) {
      return a+b;
    }, thing);
    return new Handlebars.SafeString(add)
  }
  Handlebars.registerHelper('add', add);
  Handlebars.registerHelper('concat', add);
};