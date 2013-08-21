var express = require('express'),
    handle404 = require('./handle404');

//
// This is the error handler used with Rendr routes.
//
module.exports = function() {
  return function errorHandler(err, req, res, next) {
    if (err.status === 401) {
      res.redirect('/login');
    } else if (err.status === 404 || err.status === 403) { //permission denied as 404 for now
      handle404.handle404(req, res, next);
    } else { // 500
      if (process.env.NODE_ENV == 'development') {
        express.errorHandler()(err, req, res, next);
      }
      else {
        handle404.handle500(req, res, next);
      }
    }
  };
};
