var utils = require('./utils');

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
}