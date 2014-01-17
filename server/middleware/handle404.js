var fs = require('fs');
var path = require('path');
//
// Show a 404
//
module.exports = function handle404 (req, res, next) {
    res.status(404);

    // Respond with HTML
    if (req.accepts('html')) {
      fs.readFile(path.join(__dirname, '/../../app/templates/404.hbs'), function (err, buffer) {
        var string404 = (err) ? '404' : buffer.toString();
        res.set('Content-Type', 'text/html');
        res.render(path.join(__dirname, '/../../app/templates/__layout.hbs'), {
          body: string404
        });
      })
    // Respond with JSON
    } else if (req.accepts('json')) {
      res.json({error: 'Not found'});
    // Respond with plain-text.
    } else {
      res.type('txt').send('Not found');
    }
};