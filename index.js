/*jshint strict:false */
var config = require('./lib/env').current();
var server = require('./server/server');

var port = process.env.PORT || config.port;

server.init({}, function(err) {
  if (err) throw err;
  server.start({port: port});
});
