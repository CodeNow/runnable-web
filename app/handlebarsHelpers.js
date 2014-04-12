var utils = require('./utils');
var _ = require('underscore');

module.exports.add = function (Handlebars) {
  Handlebars.registerHelper('if_eq', function(context, options) {
    if (context == options.hash.compare)
      return options.fn(this);
    return options.inverse(this);
  });

  Handlebars.registerHelper('if_gte', function(context, options) {
    if (context >= options.hash.compare)
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

  Handlebars.registerHelper('dateAgo', function (str, noAgo) {
    var moment = require('moment');
    if (typeof noAgo == 'object') {
      noAgo = false;
    }
    str = moment(str).fromNow(noAgo)
    return new Handlebars.SafeString(str);
  });

  Handlebars.registerHelper('markdown', function (str) {
    var marked = require('marked');
    str = str || '';
    return new Handlebars.SafeString(marked(str));
  });

  Handlebars.registerHelper('findWhere', function (arr, options) {
    var found = _.findWhere(arr, options.hash);
    var value = (found && found.value) || '';
    return new Handlebars.SafeString(value);
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
    return obj && obj[opts.method] && obj[opts.method].apply(obj, args);
  });

  Handlebars.registerHelper('if_result', function (obj, options) {
    var opts = options.hash;
    opts.equals = opts.equals || true;
    var args = _.chain(opts).omit('method', 'equals').values().value();
    if (obj && obj[opts.method] && obj[opts.method].apply(obj, args) === opts.equals)
      return options.fn(this);
    return options.inverse(this);
  });

  Handlebars.registerHelper('if_modulo', function (number, mod, offset, options) {
    if (typeof offset == 'object') {
      options = offset;
      offset = 0;
    }
    number += offset;
    number = parseInt(number);
    mod = parseInt(mod);
    offset = parseInt(offset);
    if (options.notzero && number===0)
      return options.inverse(this);
    if (number % mod === 0)
      return options.fn(this);
    return options.inverse(this);
  });

  Handlebars.registerHelper('each_upto', function(ary, max, options) {
    if (!ary || ary.length == 0) {
      return options.inverse(this);
    }

    var result = [ ];
    for (var i = 0; i < max && i < ary.length; ++i) {
      result.push(options.fn(ary[i]));
    }
    return result.join('');
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

