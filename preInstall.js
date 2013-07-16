// deletes the render from node_modules before every npm install
var path = require('path');
var rimraf = require('rimraf');
rimraf(path.join(__dirname, 'node_modules', 'rendr'), function (err) {
  if (err) {
    console.error('NPM PREINSTALL ERROR!! ', err);
  }
  else {
    console.log('NPM PREINSTALL SUCCESS: Squashed Rendr')
  }
});