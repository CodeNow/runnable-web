/*jshint strict:false */
require('console-trace')({ always:true });
var config = require('./server/lib/env').current;
var server = require('./server/server');

console.log(config.port);
var port = process.env.PORT || config.port;

server.init({}, function(err) {
  if (err) throw err;
  server.start({port: port});
});
