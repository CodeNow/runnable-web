// deletes the render from node_modules before every npm install
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var rimraf = require('rimraf');
var npm = require("npm");

var d = require('domain').create();
var i = d.intercept.bind(d);
var pkg = require('./package.json');
var log = console.log.bind(console);
var rendrCommitFile = path.join(__dirname, '.rendr-commit');
var rendrCommit = fs.existsSync(rendrCommitFile) ? fs.readFileSync(rendrCommitFile) : "";
var getRendrCommit = [
  "git ls-remote git://github.com/CodeNow/rendr.git",
  "grep refs/heads/master",
  "cut -f 1"
]
.join(' | ');

d.on('error', function (err) {
  console.error('NPM postinstall ERROR!! ', err.stack || err.message);
});
d.run(function () {
  exec(getRendrCommit, i(function (commitHash) {
    commitHash = commitHash.trim();
    if (commitHash == rendrCommit) {
      log('POSTINSTALL: Rendr is up-to-date (%s)', commitHash);
    }
    else {
      log('new commit found '+commitHash);
      squashRendr(function () {
        installRendr(writeCommitFile);
      });
    }
    function squashRendr (cb) {
      log('squashing rendr');
      rimraf(path.join(__dirname, 'node_modules', 'rendr'), i(cb));
    }
    function installRendr (cb) {
      log('installing rendr');
      var packages = ['rendr'].map(function(dep) {
        var pkgDep = pkg.dependencies[dep];
        return (~pkgDep.indexOf('://')) ?
          pkgDep : // If it has a protocol, assume it's a link to a repo.
          dep + '@' + pkgDep;
      });
      npm.load({cwd:__dirname}, i(function () {
        npm.commands.install(packages, i(cb));
      }));
    }
    function writeCommitFile () {
      log('installed '+commitHash);
      fs.writeFile('./.rendr-commit', commitHash, i(function(message) {
        log("POSTINSTALL: Rendr updated (%s)", commitHash);
      }));
    }
  }));
});
