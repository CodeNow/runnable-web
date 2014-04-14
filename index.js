/*jshint strict:false */
require('console-trace')({ always:true });
var os = require('os');
var config = require('./server/lib/env').current;
var pluck = require('map-utils').pluck;
var cluster = require('cluster');

var workers;
if (cluster.isMaster) {
  workers = [];
  startMonitoring();
  os.cpus().forEach(function () {
    createWorker(); // create 2 workers per core..
    createWorker();
  });
  memoryLeakPatch();
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

function killWorker (w) {
  if (!w) return;
  console.log('Kill old worker', w.id);
  setTimeout(w.kill.bind(w), maxDrainTime);
  w.disconnect();
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
    killWorker(w);
  }
}

function handleWorkerExits () {
  cluster.on('exit', function (worker, code) {
    console.error('Worker exited', worker.id, 'with code:', code);
    workers.map(pluck('id')).some(function (workerId, i) {
      if (workerId === worker.id) {
        var exited = workers.splice(i, 1); // remove worker from workers
        killWorker(exited[0]);
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
    if (err.message) console.log(err.message);
    if (err.stack) {
      console.log(err.stack);
    }
    else {
      var e = new Error('debug');
      console.log('no error stack - debug stack');
      console.log(e.stack);
    }
    process.exit(1);
  });
}