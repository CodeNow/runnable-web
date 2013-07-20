var url = require('url');
var utils = require('../../app/utils');

module.exports = function () {
	return function (req, res, next) {
    var parsed = url.parse(req.url);
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

    if (checkForChannelProject(parsed.pathname)) {
      dirty = true;
      parsed.pathname = parsed.pathname.replace(/^\/[^\/]+\//, '/');
    }

    if (dirty) {
      var newUrl = url.format({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash
      });
      res.redirect(newUrl);
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
    utils.isObjectId64(id));
}