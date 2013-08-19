var url = require('url');
var utils = require('../../app/utils');
var _ = require('underscore');
var config = require('../lib/env').current;

module.exports = function () {
  return function (req, res, next) {
    var port = (process.env.NODE_ENV == 'development') ? 3000 : null;
    var split = req.url.split('?');
    var parsed = {
      protocol: req.protocol,
      hostname: req.host,
      port: port,
      pathname: split[0],
      search: split[1] && '?'+split[1]
    };
    var dirty = false;
    if (/^www\./.test(parsed.hostname)) {
      dirty = true;
      parsed.hostname = parsed.hostname.replace(/^www\./, '');
    }

    if (/^$|\/(home|index|default)\.(php|html|aspx)/.test(parsed.pathname)) {
      dirty = true;
      parsed.pathname = '/';
    }

    if (/\/.+\/$/.test(parsed.pathname)) {
      dirty = true;
      parsed.pathname = parsed.pathname.replace(/\/$/, '');
    }

    if (dirty) {
      var newUrl = url.format(parsed);
      res.redirect(301, newUrl);
    } else {
      next();
    }
  };
};

function checkForChannelProject (path) {
  var parts = path.split('/');
  var channel = path[1];
  var id = path[2];
  return channel && id &&
    !/me|page|new/.test(channel) &&
    !utils.isObjectId64(channel) &&
    utils.isObjectId64(id);
}