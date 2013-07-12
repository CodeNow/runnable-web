var path = require('path');
//
// Show a 404
//
module.exports = function() {
  return function handle404(req, res, next) {
    res.status(404);

    // Respond with HTML
    if (req.accepts('html')) {
      res.sendfile(path.join(__dirname, '/../../app/templates/404.hbs'));

    // Respond with JSON
    } else if (req.accepts('json')) {
      res.json({error: 'Not found'});

    // Respond with plain-text.
    } else {
      res.type('txt').send('Not found');
    }
  };
};
