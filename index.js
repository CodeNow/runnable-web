/*jshint strict:false */
require('console-trace')({ always:true, right:true });
var os = require('os');
var config = require('./server/lib/env').current;
var pluck = require('map-utils').pluck;
var cluster = require('cluster');
var exists = require('exists');
var config = require('./server/lib/env').current;
var rollbar = require("rollbar");
rollbar.init(config.rollbar);

var workers;
var numWorkers = config.numWorkers || 2;
if (cluster.isMaster) {
  workers = [];
  os.cpus().forEach(function () {
    for(var i=0; i<numWorkers; i++){ // create (config.numWorkers || 2) workers per core..
      createWorker();
    }
  });
  handleWorkerExits();
}
else {
  var server = require('./server/server');
  var port = config.port;

  server.init({}, function(err) {
    if (err) throw err;
    server.start({port: port}, function(err){
      if (err) { console.log(err); }
    });
  });

  handleUncaughtExceptions();
}

function createWorker () {
  var worker = cluster.fork();
  workers.push(worker);
  console.log('Creating new worker', worker.id);
  return worker;
}

function handleWorkerExits () {
  cluster.on('exit', function (worker, code) {
    console.error('Worker exited', worker.id, 'with code:', code);
    workers.map(pluck('id')).some(function (workerId, i) {
      if (workerId === worker.id) {
        var exited = workers.splice(i, 1); // remove worker from workers
        // no need to kill worker.. it is already dieing.
        return true;
      }
    });
    if (code !== 0) { // dont restart if successful exit.
      createWorker();
    }
  });
}

function handleUncaughtExceptions () {
  process.on('uncaughtException', function (err) {
    if (err.message) {
      console.error(err.message);
    }
    if (err.stack) {
      console.error(err.stack);
    }
    else {
      var e = new Error('debug');
      console.error('no error stack - debug stack');
      console.error(e.stack);
    }
    rollbar.handleError(err);
    process.exit(1);
  });
}