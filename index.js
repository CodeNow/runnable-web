/*jshint strict:false */
require('console-trace')({ always:true });
var config = require('./server/lib/env').current;
var server = require('./server/server');

var port = config.port;

server.init({}, function(err) {
  if (err) throw err;
  server.start({port: port});
});
