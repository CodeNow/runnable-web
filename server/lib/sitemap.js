var sitemap = require('sitemap');
var async = require('async');
var request = require('request');

module.exports.init = function(app) {

  var runnable = new Runnable('');

  app.get('/sitemap.xml', function (req, res, next) {
    var urls = [
      { url: '/',  changefreq: 'weekly', priority: 0.7 },
      { url: '/providers',  changefreq: 'monthly',  priority: 0.3 },
      { url: '/about',  changefreq: 'monthly',  priority: 0.5 },
      { url: '/jobs',  changefreq: 'monthly',  priority: 0.5 },
      { url: '/privacy',  changefreq: 'monthly',  priority: 0.1 }
    ];
    async.parallel([
      function channels (cb) {
        channels.forEach(function (channel) {
          urls.push({
            url: '/' + channel,
            changefreq: 'daily',
            priority: 0.5
          });
        });
        cb();
      },
      function projects (cb) {
        projects.forEach(function (project) {
          urls.push({
            url: 'http://runnable.com/' + project._id + '/' + project.urlFriendly,
            changefreq: 'weekly',
            priority: 0.6
          });
        });
        cb();
      }
    ], function (err) {
      if (err) {
        next(err);
      } else {
        res.header('Content-Type', 'application/xml');
        res.send(sitemap.createSitemap({
          hostname: 'http://runnable.com',
          cacheTime: 600000,
          urls: urls
        }).toString());
      }
    });
  });
};