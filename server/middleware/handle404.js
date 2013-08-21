var path = require('path');
//
// Show a 404
//
module.exports.handle404 = function (req, res, next) {
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

module.exports.handle500 = function (req, res, next) {
    res.status(500);

    // Respond with HTML
    if (req.accepts('html')) {
      res.set('Content-Type', 'text/html');
      res.sendfile(path.join(__dirname, '/../../app/templates/500.hbs'));
    // Respond with JSON
    } else if (req.accepts('json')) {
      res.json({error: 'Application error'});
    // Respond with plain-text.
    } else {
      res.type('txt').send('Application error');
    }
};
