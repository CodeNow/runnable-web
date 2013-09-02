var path = require('path');
if (process.env.NODE_ENV !== 'production') {
  module.exports = function (req, res, next) {
    if (req.url === '/robots.txt') {
      var disallowRobots = path.join(__dirname, 'disallow-robots.txt');
      res.sendfile(disallowRobots);
    }
    else {
      next();
    }
  }
}
else {
  module.exports = function (req, res, next) { next(); };
}