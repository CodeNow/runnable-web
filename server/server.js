//
// Home of the main server object
//
var express = require('express'),
    connectRedis = require('connect-redis'),
    env = require('./lib/env'),
    mw = require('./middleware'),
    DataAdapter = require('./lib/data_adapter'),
    rendrServer = require('rendr').server,
    rendrMw = require('rendr/server/middleware'),
    viewEngine = require('rendr/server/viewEngine'),
    Handlebars = viewEngine.Handlebars,
    rollbar = require("rollbar"),
    sitemap = require('./lib/sitemap'),
    app;
var path = require('path');
var config = require('./lib/env').current;
var hbs = require('hbs');

function envIs (envs) {
  if (!Array.isArray(envs)) envs = [envs];
  return envs.some(function (env) {
    return process.env.NODE_ENV == env;
  });
}

// Add Handlebars helpers
require('../app/handlebarsHelpers').add(Handlebars);

// sessions storage
redisStore = connectRedis(express);

app = express();

//
// Initialize our server
//
exports.init = function init(options, callback) {
  initMiddleware();
  initLibs(function(err, result) {
    if (err) return callback(err);
    buildRoutes(app);
    callback(null, result);
  });
};

//
// options
// - port
//
exports.start = function start(options, cb) {
  options = options || {};
  var port = options.port || 3000;
  console.log('attempt listen on port '+ port);
  app.listen(port, options.ipaddress, cb);
  console.log("server pid " + process.pid + " listening on port " + port + " in " + app.settings.env + " mode");
};

//
// Initialize middleware stack
//
//
// Initialize middleware stack
//
function initMiddleware() {
  // set up views
  app.set('views', __dirname + '/../app/views');
  app.set('view engine', 'js');
  app.engine('js', viewEngine);
  // for 404 and 500 pages. rendr's viewEngine is stupid.
  hbs.registerHelper('view', function() { return ''; });
  hbs.registerHelper('json', function() { return ''; });
  hbs.registerHelper('if_eq', function() { return ''; });
  app.engine('hbs', hbs.__express);

  // set the middleware stack
  var maxAge = 0;
  if (envIs(['production', 'integration'])) {
    app.use(express.compress());
    app.use(express.staticCache());
    maxAge = 1000*60*60*24;
  }
  app.use(require('./middleware/disallowRobotsIfNotProduction'));
  app.use(express.static(__dirname + '/../public', { maxAge:maxAge }));
  app.use(require('./middleware/cannon')()); // no canon for static
  app.use(function (req, res, next) {
    if (/^\/(images|styles|scripts|external|vendor)\/.+/.test(req.url)) {
      res.send(404); // prevent static 404s from hitting router
    } else {
      next();
    }
  });
  app.use(mw.downTime());
  app.use(express.cookieParser());
  app.use(express.session({
    key: env.current.cookieKey,
    secret: env.current.cookieSecret,
    store: new redisStore(env.current.redis),
      ttl: env.current.cookieExpires,
    cookie: {
      path: '/',
      httpOnly: false,
      maxAge: env.current.cookieExpires
    }
  }));
  app.use(express.logger());
  app.use(function (req, res, next) {
    if (~(req.header('content-type') || '').indexOf('form-data')) {
      next();
    }
    else {
      express.bodyParser()(req, res, next);
    }
  });

  // app.configure('development', function() {
  //   app.use(require('./middleware/liveReload')({port:process.env.LIVERELOAD_PORT}));
  // });

  app.use(app.router);
  app.use(mw.errorHandler());
}

//
// Initialize our libraries
//
function initLibs(callback) {
  var options;
  options = {
    dataAdapter: new DataAdapter(env.current.api),
    errorHandler: mw.errorHandler()
  };
  rendrServer.init(options, callback);
}

//
// Routes & middleware
//

// Attach our routes to our server
function buildRoutes(app) {
  sitemap.init(app);
  buildApiRoutes(app);
  buildRendrRoutes(app);
  app.post('/pressauth', function (req, res, next) {
    if (req.body.password.toLowerCase() == 'discovercode') {
      res.cookie('pressauth', true, { expires: new Date(Date.now() + 1000*60*60*24) });
      res.json(201, {message:'successful login'});
    }
    else {
      res.json(403, {message:'successful login'});
    }
    res.redirect('/');
  });
  app.get(/^(?!\/api\/)/, mw.handle404);
}

// Insert these methods before Rendr method chain for all routes, plus API.
var preRendrMiddleware = [
  // Initialize Rendr app, and pass in any config as app attributes.
  rendrMw.initApp(env.current.rendrApp)
];

function buildApiRoutes(app) {
  rendrMw.apiProxy(app, preRendrMiddleware);
  // var fnChain = preRendrMiddleware.concat(rendrMw.apiProxy());
  // fnChain.forEach(function(fn) {
  //   app.use('/api', fn);
  // });
}

function buildRendrRoutes(app) {
  var routes, path, definition, fnChain;
  // attach Rendr routes to our Express app.
  routes = rendrServer.router.buildRoutes();
  routes.forEach(function(args) {
    path = args.shift();
    definition = args.shift();

    // Additional arguments are more handlers.
    fnChain = preRendrMiddleware.concat(args);

    // Have to add error handler AFTER all other handlers.
    fnChain.push(mw.errorHandler());

    // Attach the route to the Express server.
    app.get(path, fnChain);
  });
}


process.on('uncaughtException', function (err) {
  console.log(err);
  if (err.message) console.log(err.message);
  if (err.stack) {
    console.log(err.stack);
  }
  else {
    var e = new Error('debug');
    console.log('no error stack - debug stack');
    console.log(e.stack);
  }
  process.exit();
})