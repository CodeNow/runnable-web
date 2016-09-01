var utils = require('rendr/server/utils'),
    _ = require('underscore'),
    cookie = require('cookie'),
    url = require('url'),
    request = require('request'),
    env = require('./env'),
    debug = require('debug')('app:DataAdapter'),
    rollbar = require("rollbar"),
    inspect = require('util').inspect;

var httpProxy = require('http-proxy');
var proxy = new httpProxy.RoutingProxy();
var split = env.current.api['default'].host.split(':');
var apiHost = split[0];
var apiPort = split[1] ? parseInt(split[1], 10) : 80;

module.exports = DataAdapter;

function DataAdapter(options) {
  this.options = options || {};
}

//
// `req`: Actual request object from Express/Connect.
// `api`: Object describing API call; properties including 'path', 'query', etc.
//        Passed to `url.format()`.
// `options`: (optional) Options.
// `callback`: Callback.
//
DataAdapter.prototype.request = function(req, api, options, callback, res) {
  if (~(req.header('content-type') || '').indexOf('form-data')) {
    // true proxy.. for form-data requests
    req.url = api.path;
    req.headers.host = apiHost;
    req.headers['runnable-token'] = req.session.access_token;
    console.log("Access Token: " + req.session.access_token);
    // dont worry about setting the access token here, we can assume a multipart request will never be the
    // first request to the server
    proxy.proxyRequest(req, res, {
      host: apiHost,
      port: apiPort
    });
  }
  else {
    this._request.apply(this, arguments);
  }
};

DataAdapter.prototype._request = function (req, api, options, callback) {
  var _this = this, start, end;
  if (arguments.length === 3) {
    callback = options;
    options = {};
  }

  options = _.clone(options);
  _.defaults(options, {
    convertErrorCode: true,
    allow4xx: false
  });
;
  api = this.apiDefaults(api);
  api.timeout = 900000;

  if (req.session && req.session.access_token) {
    api.headers['runnable-token'] = req.session.access_token;
    api.headers['x-forwarded-for'] = req.headers['x-forwarded-for'];
    api.headers['x-real-ip'] = req.headers['x-forwarded-for'];
    console.log("Access Token: " + req.session.access_token);
  }

  start = new Date().getTime();
  request(api, function(err, response, body) {
    if (err) {
      console.log("API Error: " + err.code + " while " + api.method + " to " + api.path, "error", body);
      rollbar.reportMessage("API Error: " + err.code + " while " + api.method + " to " + api.path, "error", req);
      return callback(err);
    }

    // Removing this causes misery
    try {
      body = JSON.parse(body);
    } catch (e) {}

    end = new Date().getTime();

    // debug('%s %s %s %sms', api.method.toUpperCase(), api.url, response.statusCode, end - start);
    // debug('%s', inspect(response.headers));

    console.log("TOKEN IS", (req.session || {}).access_token);

    if (req.session) {
      if ((api.path == '/users' || api.path == '/token') && api.method == 'POST') {
        if (response.statusCode == 200 || response.statusCode == 201) {
          req.session.access_token = body.access_token;
        }
      }
    }

    if (options.convertErrorCode) {
      err = _this.getErrForResponse(response, {allow4xx: options.allow4xx});
    }
    if (typeof body === 'string' && ~(response.headers['content-type'] || '').indexOf('application/json')) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        err = e;
      }
    }
    callback(err, response, body);
  });
}

DataAdapter.prototype.apiDefaults = function(api) {
  var urlOpts, basicAuth, authParts, apiHost;

  api = _.clone(api);

  // If path contains a protocol, assume it's a URL.
  if (api.path && ~api.path.indexOf('://')) {
    api.url = api.path;
    delete api.path;
  }

  api.jar = false;

  // Can specify a particular API to use, falling back to default.
  apiHost = this.options[api.api] || this.options['default'] || this.options || {};

  urlOpts = _.defaults(
    _.pick(api, 'protocol', 'port', 'query'),
    _.pick(apiHost, ['protocol', 'port', 'host'])
  );
  urlOpts.pathname = api.path || api.pathname;

  api = _.defaults(api, {
    method: 'GET',
    url: url.format(urlOpts),
    headers: {},
    pool: false
  });

  if (api.body != null) {
    api.json = api.body;
  }

  return api;
};

// Convert 4xx, 5xx responses to be errors.
DataAdapter.prototype.getErrForResponse = function(res, options) {
  var status, err;
  status = +res.statusCode;
  err = null;
  if (utils.isErrorStatus(status, options)) {
    err = new Error(status + " status");
    err.status = status;
    err.body = res.body;
  }
  return err;
};
