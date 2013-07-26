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
    app;

rollbar.handleUncaughtExceptions(env.current.rollbar);

// Add Handlebars helpers
addHandlebarsHelpers();

// sessions storage
redisStore = connectRedis(express);

app = express();

if (process.env.NODE_ENV == 'development') {
  var liveReloadPort = 35731;
  var mergedCSSPath   = 'public/styles/index.css';
  // Create a live reload server instance
  var lrserver = require('tiny-lr')();
  // Listen on port 35729
  lrserver.listen(liveReloadPort, function(err) { console.log('LR Server Started'); });
  // Then later trigger files or POST to localhost:35729/changed
  lrserver.changed({body:{files:[
    'public/mergedAssets.js',
    mergedCSSPath,
    'public/images/*.*'
  ]}});
}

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
  app.listen(port, cb);
  console.log("server pid " + process.pid + " listening on port " + port + " in " + app.settings.env + " mode");
};

//
// Initialize middleware stack
//
function initMiddleware() {
  app.configure(function() {
    // set up views
    app.set('views', __dirname + '/../app/views');
    app.set('view engine', 'js');
    app.engine('js', viewEngine);

    // set the middleware stack
    if (process.env.NODE_ENV != 'development')
      app.use(express.compress());

    app.use(rollbar.errorHandler());
    app.use(express.static(__dirname + '/../public'));
    app.use(express.cookieParser());
    app.use(express.session({
      key: env.current.cookieKey,
      secret: env.current.cookieSecret,
      store: new redisStore,
        ttl: env.current.cookieExpires,
      cookie: {
        path: '/',
        httpOnly: false,
        maxAge: env.current.cookieExpires
      }
    }));
    app.use(express.logger());
    app.use(express.bodyParser());
    if (process.env.NODE_ENV == 'development')
      app.use(require('./middleware/liveReload')({port:liveReloadPort}));
    app.use(app.router);
    app.use(mw.errorHandler());
  });
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
  buildApiRoutes(app);
  buildRendrRoutes(app);
  app.get(/^(?!\/api\/)/, mw.handle404());
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

function addHandlebarsHelpers() {
  var utils = require('../app/utils');

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
}
