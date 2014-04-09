/*jshint strict:false */
require('console-trace')({ always:true });
var os = require('os');
var config = require('./server/lib/env').current;

var cluster = require('cluster');

var workers = [];
if (cluster.isMaster) {
  startMonitoring();
  os.cpus().forEach(function () {
    createWorker(); // create 2 workers per core..
    createWorker();
  });
  memoryLeakPatch();
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
}

function createWorker () {
  var worker = cluster.fork();
  workers.push(worker);
  console.log('Creating new worker', worker.id);
  return worker;
}

function startMonitoring () {
  if (process.env.NODE_ENV === 'production' && config.nodetime) {
    var nodetime = require('nodetime');
    nodetime.profile(config.nodetime);
  }
  if (config.newrelic) {
    require('newrelic');
  }
}

function memoryLeakPatch () {
  // memory leak patch! - start restart timeout
  var numWorkers = os.cpus().length * 2;
  var restartTime  = 4 * 60 * 60 *1000;
  var maxDrainTime = 30 * 1000;
  setInterval(killAndStartNewWorker, restartTime/numWorkers);
  function killAndStartNewWorker (message) {
    var w = workers.shift();
    createWorker();

    console.log('Kill old worker', w.id);
    setTimeout(w.kill.bind(w), maxDrainTime);
    w.disconnect();
  }
}