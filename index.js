/*jshint strict:false */
require('console-trace')({ always:true });
var config = require('./server/lib/env').current;
var server = require('./server/server');
if (configs.newrelic) {
  require('newrelic');
}
var port = config.port;

server.init({}, function(err) {
  if (err) throw err;
  server.start({port: port}, function(err){
    if (err) { console.log(err); }
  });
});
