var config = require('../lib/env').current;

module.exports = function () {
  return function (req, res, next) {
    if (!config.downTime) {
      next();
    }
    else {
      res.set('Status', '503 Service Temporarily Unavailable');
      res.set('Retry-After', config.downTime);
      if (req.accepts('html')) {
        res.set('Content-Type', 'text/html');
        res.status(503);
        var view = path.join(__dirname,'../app/templates/503.hbs');
        console.log(view);
        res.sendfile(view);
      }
      else if (req.accepts('json')) {
        res.json(503, {message: '503 Service Temporarily Unavailable'});
      }
    }
  };
};